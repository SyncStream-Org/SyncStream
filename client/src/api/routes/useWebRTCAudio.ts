import SessionState from '@/utilities/session-state';
import { useState, useEffect, useCallback } from 'react';

let combinedOutput = new MediaStream();
let audioInID: string = '';
let audioOutID: string = '';
let channel: String | undefined;
const peerConnections: Map<string, RTCPeerConnection> = new Map();
let socket: WebSocket | undefined;

const waitForOpenConnection = (ws: WebSocket): Promise<void> => {
  return new Promise((resolve, reject) => {
    const maxNumberOfAttempts = 10;
    const intervalTime = 200; // ms

    let currentAttempt = 0;
    const interval = setInterval(() => {
      if (currentAttempt > maxNumberOfAttempts - 1) {
        clearInterval(interval);
        reject(new Error('Maximum number of attempts exceeded'));
      } else if (ws.readyState === ws.OPEN) {
        clearInterval(interval);
        resolve();
      }
      currentAttempt += 1;
    }, intervalTime);
  });
};

const waitForAnswer = (username: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const maxNumberOfAttempts = 10;
    const intervalTime = 200; // ms

    let currentAttempt = 0;
    const interval = setInterval(() => {
      if (currentAttempt > maxNumberOfAttempts - 1) {
        clearInterval(interval);
        resolve(false);
      } else if (peerConnections.has(username)) {
        clearInterval(interval);
        resolve(true);
      }
      currentAttempt += 1;
    }, intervalTime);
  });
};

function createPeerConnection() {
  console.log(socket);
  if (socket === undefined) {
    throw Error(
      'Tried to create a new peer connection when not connected to a call.',
    );
  }

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.l.google.com:5349' },
      { urls: 'stun:stun1.l.google.com:3478' },
      { urls: 'stun:stun1.l.google.com:5349' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:5349' },
      { urls: 'stun:stun3.l.google.com:3478' },
      { urls: 'stun:stun3.l.google.com:5349' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:5349' },
    ],
  };
  const pc = new RTCPeerConnection(configuration);

  // Handle new candidate
  pc.onicecandidate = (e) => {
    const message: {
      type: string;
      candidate: {
        candidate?: string | null;
        sdpMid?: string | null;
        sdpMLineIndex?: number | null;
      };
    } = {
      type: 'candidate',
      candidate: {},
    };

    if (e.candidate) {
      message.candidate.candidate = e.candidate.candidate;
      message.candidate.sdpMid = e.candidate.sdpMid;
      message.candidate.sdpMLineIndex = e.candidate.sdpMLineIndex;
    }

    if (socket === undefined) {
      console.error('ICE Candidate tried to send when not connected to call.');
      return;
    }
    socket.send(JSON.stringify(message));
  };

  pc.ontrack = (event) => {
    document.getElementById('remoteAudio').srcObject = event.streams[0];
  };

  // Add audio tracks to the peer connection
  console.log(combinedOutput);
  combinedOutput.getTracks().forEach((track) => {
    console.log(track);
    pc.addTrack(track);
  });

  return pc;
}

// Function for initiating an audio call
export async function initiateAudioCall(roomID: string, newChannel: string) {
  if (socket !== undefined) {
    throw Error("Can't get in new call, already in call.");
  }

  console.log('Initiating Call');

  // Initiate web socket for signaller
  const webSocketPrefix = SessionState.getInstance().serverURL.includes('https')
    ? 'wss'
    : 'ws';
  const newSocket = new WebSocket(
    `${webSocketPrefix}://${SessionState.getInstance().serverURL.split('//')[1]}/rooms/${roomID}/voice/${newChannel}?token=${SessionState.getInstance().sessionToken}&userid=${SessionState.getInstance().currentUser.username}`,
  );

  // Handle events from server
  newSocket.onmessage = async (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'join') {
      console.log('JOIN');
      // On join, send a offer to other
      if (peerConnections.has(message.username)) {
        console.error(
          'Someone who already has a connection to you wants to make another.',
        );
        return;
      }

      const pc = createPeerConnection();
      const offer = await pc.createOffer();
      newSocket.send(
        JSON.stringify({
          type: 'offer',
          to: message.username,
          sdp: offer.sdp,
        }),
      );
      await pc.setLocalDescription(offer);

      peerConnections.set(message.username, pc);
    } else if (message.type === 'leave') {
      console.log('LEAVE');
      peerConnections.delete(message.username);
    } else if (message.type === 'offer') {
      console.log('OFFER');
      if (peerConnections.has(message.username)) {
        console.error(
          'Someone who already has a connection to you wants to make another.',
        );
        return;
      }

      const pc = createPeerConnection();
      console.log(message);
      await pc.setRemoteDescription(message);

      const answer = await pc.createAnswer();
      newSocket.send(
        JSON.stringify({
          type: 'answer',
          to: message.username,
          sdp: answer.sdp,
        }),
      );
      await pc.setLocalDescription(answer);

      peerConnections.set(message.username, pc);
    } else if (message.type === 'answer') {
      console.log('ANSWER');
      if (!peerConnections.has(message.username)) {
        console.error('Someone answered a non existent offer.');
        return;
      }

      const pc = peerConnections.get(message.username);
      if (pc === undefined) throw Error('Unreachable');
      await pc.setRemoteDescription(message);
    } else if (message.type === 'candidate') {
      console.log(peerConnections, message);
      console.log('CANDIDATE');

      const res = await waitForAnswer(message.username);
      if (!res) {
        console.error('Someone answered a non existent offer.');
        return;
      }

      const pc = peerConnections.get(message.username);
      if (pc === undefined) throw Error('Unreachable');

      if (!message.candidate.candidate) {
        await pc.addIceCandidate(null);
      } else {
        await pc.addIceCandidate(message.candidate);
      }
    }
  };

  newSocket.onclose = (e) => {
    if (![1000, 1005].includes(e.code)) {
      console.error(e.reason);
    }

    socket = undefined;
    channel = undefined;
  };

  try {
    await waitForOpenConnection(newSocket);
  } catch (e) {
    console.error(e);
    return;
  }
  newSocket.send(JSON.stringify({ type: 'join' }));
  console.log('Socket OPEN');

  channel = newChannel;
  socket = newSocket;
}

export async function closeAudioCall() {
  if (socket === undefined || channel === undefined) return;
  console.log('Closing Call');

  socket.send(JSON.stringify({ type: 'leave' }));
  socket.close();
  peerConnections.clear();
}

export function resetAudio() {
  combinedOutput = new MediaStream();
}

export function addStreamToAudio(stream: MediaStream) {
  stream.getTracks().forEach((val) => combinedOutput.addTrack(val));
}

export function setInID(id: string) {
  audioInID = id;
}

export function setOutID(id: string) {
  audioOutID = id;
}

export function getCurrentIO() {
  return [audioInID, audioOutID];
}

// Build and contain the WebRTC instance for Audio
export function useWebRTCAudio() {
  // Initialize audio devices
  useEffect(() => {
    // Grab initial audio devices
    //   async function init() {
    //     combinedOutput = await navigator.mediaDevices.getUserMedia({
    //       audio: true,
    //       video: false,
    //     });
    //   }

    //   init();
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const inputs = devices.filter((device) => device.kind === 'audioinput');
      const outputs = devices.filter((device) => device.kind === 'audiooutput');

      audioInID = inputs[0].deviceId;
      audioOutID = inputs[0].deviceId;
      console.log(inputs[0], outputs[0]);
      combinedOutput = new MediaStream();
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: inputs[0].deviceId,
          },
        })
        .then((stream) => {
          stream.getTracks().forEach((val) => combinedOutput.addTrack(val));
        });

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: outputs[0].deviceId,
          },
        })
        .then((stream) => {
          stream.getTracks().forEach((val) => combinedOutput.addTrack(val));
        });
    });

    // Call on unload to close any call that exists
    return () => {
      closeAudioCall();
    };
  }, []);
}
