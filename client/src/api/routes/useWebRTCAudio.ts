import { useState, useEffect, useCallback } from 'react';
import hark from 'hark';
import SessionState from '@/utilities/session-state';

// Audio Streams
let localInput: MediaStream | undefined;
const combinedOutput = new MediaStream();

// Connection Variables
let socket: WebSocket | undefined;
let channel: string | undefined;
let roomID: string | undefined;
const peerConnections: Map<string, RTCPeerConnection> = new Map();
const peerTracks: Map<string, MediaStreamTrack[]> = new Map();
const channelMetadata: Map<string, boolean> = new Map();

// If in a call (errors on impossible state)
export function isInCall(): boolean {
  if (socket !== undefined && channel !== undefined && roomID !== undefined) {
    // In Call
    return true;
  }

  if (socket === undefined && channel === undefined && roomID === undefined) {
    // Not In Call
    return false;
  }

  // Socket or channel is defined while the other isn't... HOW?>?!?>
  throw Error('Impossible state reached in WebRTC Voice Call.');
}

// Waits for the socket connection to open
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

// Waits for an answer from peer (for username to be in peerConnections)
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

function trackAudioLevels(username: string, stream: MediaStream) {
  const userStream = hark(stream);

  userStream.on('speaking', () => {
    if (channelMetadata.has(username)) {
      channelMetadata.set(username, true);
    }
  });

  userStream.on('stopped_speaking', () => {
    if (channelMetadata.has(username)) {
      channelMetadata.set(username, false);
    }
  });
}

// Create a peerConnection
function createPeerConnection(username: string) {
  // Sanity check to make sure you are in a call
  if (!isInCall()) {
    throw Error(
      'Tried to create a new peer connection when not connected to a call.',
    );
  }
  // track the current user's audio level
  trackAudioLevels(
    SessionState.getInstance().currentUser.username,
    localInput!,
  );
  // ICE servers for NAT problems (google free servers)
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
    // Sanity check due to lingering connections
    if (!isInCall()) {
      console.error('ICE Candidate tried to send when not connected to call.');
      return;
    }

    // Build message to propogate
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

    // Send to other peers
    socket?.send(JSON.stringify(message));
  };

  // Setup output track handling
  peerTracks.set(username, []); // Make sure tracks can be placed in map
  pc.ontrack = (event) => {
    channelMetadata.set(username, false);
    trackAudioLevels(username, event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      // Place in combined output and in peerTracks
      console.log(track);
      combinedOutput.addTrack(track);
      peerTracks.get(username)?.push(track);
    });
  };

  // Add local audio input to the peer connection
  if (localInput === undefined)
    throw Error(
      'Initiated a peer connection before a local audio input was set.',
    );

  localInput.getTracks().forEach((track) => {
    pc.addTrack(track, localInput as MediaStream);
  });

  return pc;
}

// Function for initiating an audio call
export async function initiateAudioCall(newRoomID: string, newChannel: string) {
  // Sanity checks
  if (isInCall()) {
    throw Error("Can't get in new call, already in call.");
  }

  // Initiate web socket for signal server
  const webSocketPrefix = SessionState.getInstance().serverURL.includes('https')
    ? 'wss'
    : 'ws';
  const newSocket = new WebSocket(
    `${webSocketPrefix}://${
      SessionState.getInstance().serverURL.split('//')[1]
    }/rooms/${newRoomID}/voice/${newChannel}?token=${
      SessionState.getInstance().sessionToken
    }&userid=${SessionState.getInstance().currentUser.username}`,
  );

  channelMetadata.set(SessionState.getInstance().currentUser.username, false);

  // Handle events from server
  newSocket.onmessage = async (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'join') {
      // On join, send a offer to the client that joined
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
      // Delete user peer connection and tracks from combined output
      peerConnections.delete(message.username);
      peerTracks.get(message.username)?.forEach((val) => {
        combinedOutput.removeTrack(val);
      });
      peerTracks.delete(message.username);
      channelMetadata.delete(message.username);
    } else if (message.type === 'offer') {
      // On offer from other peer, create peer connection and send answer
      if (peerConnections.has(message.username)) {
        console.error(
          'Someone who already has a connection to you wants to make another.',
        );
        return;
      }

      const pc = createPeerConnection(message.username);
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
      // On answer from peer, handle description
      if (!peerConnections.has(message.username)) {
        console.error('Someone answered a non existent offer.');
        return;
      }

      const pc = peerConnections.get(message.username);
      if (pc === undefined) throw Error('Unreachable');
      await pc.setRemoteDescription(message);
    } else if (message.type === 'candidate') {
      // Handle candidates from other peers
      const res = await waitForAnswer(message.username);
      if (!res) {
        // Error on timeout
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
    // If non stanard code, print reason
    if (![1000, 1005].includes(e.code)) {
      console.error(`${e.code}: ${e.reason}`);
    }

    if (e.code === 1008 && e.reason.includes('Media ID is invalid')) {
      throw Error('Tried to join a call that does not exist.');
    }

    // Set socket and channel as undefined
    socket = undefined;
    channel = undefined;
    roomID = undefined;
  };

  // Wait for socket to open and send the join message
  try {
    await waitForOpenConnection(newSocket);
  } catch {
    return;
  }
  newSocket.send(JSON.stringify({ type: 'join' }));

  // Set socket and channel
  channel = newChannel;
  roomID = newRoomID;
  socket = newSocket;
}

// Close and clean up an audio call
export async function closeAudioCall() {
  // Sanity check. If not in call, no need to run the rest, but not an error as this is called on unload
  if (!isInCall()) return;

  // Close and cleanup socket
  socket?.send(JSON.stringify({ type: 'leave' }));
  socket?.close();
  socket = undefined;

  // Clear peer connections and tracks
  peerConnections.clear();
  peerTracks.clear();
  channelMetadata.clear();

  // Clear remote media streams
  combinedOutput.getAudioTracks().forEach((track) => {
    track.stop();
    combinedOutput.removeTrack(track);
  });

  // Stop local tracks
  localInput?.getTracks().forEach((track) => {
    if (track.readyState === 'live') {
      track.stop();
    }
  });

  // Set channel as undefined
  localInput = undefined;
  channel = undefined;
  roomID = undefined;
}

// Get current local input device
export function getLocalInputDevice() {
  return localInput;
}

// Set local input device from somehwere else (reset call if needed)
export function setLocalInputDevice(stream: MediaStream) {
  // Set new input
  localInput = stream;

  // If in call, reset
  if (isInCall()) {
    const channelCache = channel as string;
    const roomCache = roomID as string;
    closeAudioCall();
    initiateAudioCall(roomCache, channelCache);
  }
}

// Build and contain the WebRTC instance for Audio
export function useWebRTCAudio() {
  const [audioData, setAudioData] = useState<
    Array<{ name: string; isTalking: boolean }>
  >([]);

  // Initialize audio devices
  useEffect(() => {
    // Grab default local microphone (if not set yet)
    const audioID = SessionState.getInstance().audioDeviceID;
    if (audioID) {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: audioID,
          },
        })
        .then((stream) => {
          localInput = stream;
        });
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          localInput = stream;
        });
    }

    const pollAudio = setInterval(() => {
      const dataArray = Array.from(channelMetadata.entries()).map(
        ([key, val]) => {
          return { name: key, isTalking: val };
        },
      );
      setAudioData(dataArray);
    }, 100);
    // Link remote output to audio elemnt
    if (document.getElementById('remoteAudioPlayer') !== null) {
      document!.getElementById('remoteAudioPlayer')!.srcObject = combinedOutput;
    }
    // Call on unload to close any call that exists
    return () => {
      closeAudioCall();
      clearInterval(pollAudio);
    };
  }, []);

  return audioData;
}
