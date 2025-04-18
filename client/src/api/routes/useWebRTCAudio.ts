import { useState, useEffect, useCallback } from 'react';
import SessionState from '@/utilities/session-state';

let localInput = new MediaStream();
let combinedOutput = new MediaStream();

let audioInID: string = '';
let audioOutID: string = '';
let channel: String | undefined;
const peerConnections: Map<string, RTCPeerConnection> = new Map();
const peerTracks: Map<string, MediaStreamTrack[]> = new Map();
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

function createPeerConnection(username: string) {
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

  // Setup output track handling
  peerTracks.set(username, []);
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      combinedOutput.addTrack(track);
      peerTracks.get(username)?.push(track);
    });
  };

  // Add audio tracks to the peer connection
  console.log(localInput);
  localInput.getTracks().forEach((track) => {
    console.log(track);
    pc.addTrack(track, localInput);
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
    `${webSocketPrefix}://${
      SessionState.getInstance().serverURL.split('//')[1]
    }/rooms/${roomID}/voice/${newChannel}?token=${
      SessionState.getInstance().sessionToken
    }&userid=${SessionState.getInstance().currentUser.username}`,
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

      const pc = createPeerConnection(message.username);
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
      // Delete user peer connection and tracks from combined output
      peerConnections.delete(message.username);
      peerTracks.get(message.username)?.forEach((val) => {
        combinedOutput.removeTrack(val);
      });
      peerTracks.delete(message.username);
    } else if (message.type === 'offer') {
      console.log('OFFER');
      if (peerConnections.has(message.username)) {
        console.error(
          'Someone who already has a connection to you wants to make another.',
        );
        return;
      }

      const pc = createPeerConnection(message.username);
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
        await pc.addIceCandidate(undefined);
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
  peerTracks.clear();
  combinedOutput.getAudioTracks().forEach((track) => {
    combinedOutput.removeTrack(track);
  });
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
    // Grab local microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        localInput = stream;
      });

    // Link remote output to audio elemnt
    document.getElementById('remoteAudio').srcObject = combinedOutput;

    // Call on unload to close any call that exists
    return () => {
      closeAudioCall();
      combinedOutput = new MediaStream();
    };
  }, []);
}
