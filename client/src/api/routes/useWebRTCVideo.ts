import { useEffect } from 'react';
import SessionState from '@/utilities/session-state';

// Audio Streams
let localInput: MediaStream | undefined;
const remoteOutput = new MediaStream();

// Connection Variables
let socket: WebSocket | undefined;
let channel: string | undefined;
let roomID: string | undefined;
const peerConnections: Map<string, RTCPeerConnection> = new Map(); // Could only be one if in client mode
let isClient: boolean | undefined;

// If in a call (errors on impossible state)
export function isInCall(): boolean {
  if (
    socket !== undefined &&
    channel !== undefined &&
    roomID !== undefined &&
    isClient !== undefined
  ) {
    // In Call
    return true;
  }

  if (
    socket === undefined &&
    channel === undefined &&
    roomID === undefined &&
    isClient === undefined
  ) {
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

// Create a peerConnection
function createPeerConnection() {
  // Sanity check to make sure you are in a call
  if (!isInCall()) {
    throw Error(
      'Tried to create a new peer connection when not connected to a call.',
    );
  }
  console.log('Creating peer connection');
  if (!isClient && localInput === undefined)
    throw Error(
      'Initiated a peer connection before a local video input was set.',
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

  // Setup output track handling for client connections
  if (isClient) {
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        // Place in remote output
        console.log(track);
        remoteOutput.addTrack(track);
      });
    };
  } else {
    // Add local video input to the peer connection if not client
    if (localInput === undefined) throw Error('unreachable');
    localInput.getTracks().forEach((track) => {
      console.log(track);
      pc.addTrack(track, localInput as MediaStream);
    });
  }

  return pc;
}

// Function for initiating an video call
export async function initiateVideoCall(
  newRoomID: string,
  newChannel: string,
  newIsClient: boolean,
  sourceID?: string,
) {
  // Sanity checks
  if (isInCall()) {
    throw Error("Can't get in new call, already in call.");
  }
  console.log(newRoomID, newChannel, newIsClient, sourceID);
  // Grab default local video (if not set yet)
  if (!newIsClient) {
    if (!sourceID) {
      throw new Error('Need a sourceID to start a video call.');
    }
    try {
      localInput = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceID,
          },
        },
      });
    } catch {
      window.electron.ipcRenderer.invokeFunction('show-message-box', {
        title: 'Error',
        message: 'Could not get any video device.',
      });
      return;
    }
    // add the local input to the remote output so the streamer can see
    localInput.getTracks().forEach((track) => {
      remoteOutput.addTrack(track);
    });
  }

  // Initiate web socket for signal server
  const webSocketPrefix = SessionState.getInstance().serverURL.includes('https')
    ? 'wss'
    : 'ws';
  const newSocket = new WebSocket(
    `${webSocketPrefix}://${
      SessionState.getInstance().serverURL.split('//')[1]
    }/rooms/${newRoomID}/stream/${newChannel}?token=${
      SessionState.getInstance().sessionToken
    }&userid=${
      SessionState.getInstance().currentUser.username
    }&isClient=${newIsClient}`,
  );

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

      // Sanity checks for clients
      if (newIsClient && !message.isServer) {
        console.error(
          'Someone tried to send a message as a client when you are are the client.',
        );
        return;
      }

      if (!newIsClient && message.isServer) {
        console.error(
          'Someone tried to send a message as a server when you are are the server.',
        );
        return;
      }

      if (newIsClient && message.isServer && peerConnections.size >= 1) {
        console.error(
          'Someone tried to send a join message as a server when you are already connected to a server.',
        );
        return;
      }
      const pc = createPeerConnection();
      const options = newIsClient
        ? { offerToReceiveAudio: true, offerToReceiveVideo: true }
        : {};
      const offer = await pc.createOffer(options);
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
      // Sanity checks for clients
      if (newIsClient && !message.isServer) {
        console.error(
          'Someone tried to send a message as a client when you are are the client.',
        );
        return;
      }

      if (!newIsClient && message.isServer) {
        console.error(
          'Someone tried to send a message as a server when you are are the server.',
        );
        return;
      }

      if (newIsClient && message.isServer && peerConnections.size === 0) {
        console.error(
          'Someone tried to send a leave message as a server when you are not connected to a server.',
        );
        return;
      }

      // Delete user peer connection and tracks from combined output
      peerConnections.delete(message.username);

      // Remove stream if server leaves for client
      if (newIsClient) {
        remoteOutput.getTracks().forEach((val) => {
          remoteOutput.removeTrack(val);
        });
      }
    } else if (message.type === 'offer') {
      // On offer from other peer, create peer connection and send answer
      if (peerConnections.has(message.username)) {
        console.error(
          'Someone who already has a connection to you wants to make another.',
        );
        return;
      }

      // Sanity checks for clients
      if (newIsClient && !message.isServer) {
        return;
      }

      if (!newIsClient && message.isServer) {
        console.error(
          'Someone tried to send a message as a server when you are are the server.',
        );
        return;
      }

      if (newIsClient && message.isServer && peerConnections.size >= 1) {
        console.error(
          'Someone tried to send an offer message as a server when you are already connected to a server.',
        );
        return;
      }
      const pc = createPeerConnection();
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

      // Sanity checks
      if (newIsClient && !message.isServer) {
        return;
      }

      if (!newIsClient && message.isServer) {
        console.error(
          'Someone tried to send a message as a server when you are are the server.',
        );
        return;
      }

      const pc = peerConnections.get(message.username);
      if (pc === undefined) throw Error('Unreachable');
      await pc.setRemoteDescription(message);
    } else if (message.type === 'candidate') {
      // Sanity checks
      if (newIsClient && !message.isServer) {
        return;
      }

      if (!newIsClient && message.isServer) {
        console.error(
          'Someone tried to send a message as a server when you are are the server.',
        );
        return;
      }

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

    if (e.code === 1008 && e.reason.includes('FUCK OFF')) {
      window.electron.ipcRenderer.invokeFunction('show-message-box', {
        title: 'error',
        message: 'Tried to start a stream when someone already started one.',
      });
    }

    localInput?.getTracks().forEach((track) => {
      track.stop();
    });
    remoteOutput.getTracks().forEach((track) => {
      track.stop();
      remoteOutput.removeTrack(track);
    });

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
  isClient = newIsClient;
}

// Close and clean up an audio call
export async function closeVideoCall() {
  // Sanity check. If not in call, no need to run the rest, but not an error as this is called on unload
  if (!isInCall()) return;

  // Close and cleanup socket
  socket?.send(JSON.stringify({ type: 'leave' }));
  socket?.close();
  socket = undefined;

  // Clear peer connections and tracks
  peerConnections.clear();

  // Clear remote media streams
  remoteOutput.getTracks().forEach((track) => {
    track.stop();
    remoteOutput.removeTrack(track);
  });

  // Stop local tracks
  if (!isClient) {
    localInput?.getTracks().forEach((track) => {
      console.log(track);
      if (track.readyState === 'live') {
        track.stop();
      }
    });
  }

  // Set channel as undefined
  localInput = undefined;
  channel = undefined;
  roomID = undefined;
  isClient = undefined;
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
    const isClientCache = isClient as boolean;
    closeVideoCall();
    initiateVideoCall(roomCache, channelCache, isClientCache);
  }
}

// Build and contain the WebRTC instance for Audio
export function useWebRTCVideo() {
  // Initialize audio devices
  useEffect(() => {
    // Link remote output to audio elemnt
    if (document.getElementById('remoteVideoPlayer') !== null) {
      document!.getElementById('remoteVideoPlayer')!.srcObject = remoteOutput;
    } else {
      console.error('No remote video player found.');
    }

    // Call on unload to close any call that exists
    return () => {
      closeVideoCall();
    };
  }, []);
}
