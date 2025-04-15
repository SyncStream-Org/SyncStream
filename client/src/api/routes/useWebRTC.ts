import SessionState from '@/utilities/session-state';
import { useState, useEffect, useCallback } from 'react';

// Build and contain the WebRTC instance for Audio
export function useWebRTCAudio(roomID: string) {
  const [audioInput, setAudioInput] = useState<MediaStream | undefined>(
    undefined,
  );
  const [audioOutput, setAudioOutput] = useState<MediaStream | undefined>(
    undefined,
  );
  const [channel, setChannel] = useState<String | undefined>(undefined);
  const [peerConnections, setPeerConnections] = useState<
    Map<String, RTCPeerConnection>
  >(new Map());
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  // Creates a new peer peerConnection
  const createPeerConnection = () => {
    if (socket === undefined) {
      throw Error(
        'Tried to create a new peer connection when not connected to a call.',
      );
    }

    if (audioInput === undefined || audioOutput === undefined) {
      throw Error(
        'Tried to create a new peer connection when no audio devices are set.',
      );
    }

    const pc = new RTCPeerConnection();

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
        console.error(
          'ICE Candidate tried to send when not connected to call.',
        );
        return;
      }
      socket.send(JSON.stringify(message));
    };

    // Handle new track
    // pc.ontrack = (e) => {
    //   // Ensure the audio plays on the remote side.
    //   if (!senderCall) {
    //     remoteStreamCopy = e.streams[0];

    //     remoteStreamCopy.getAudioTracks()[0].addEventListener('mute', () => {
    //       DumpEvent('muted:remoteCopy')
    //     })

    //     remoteStreamCopy.getAudioTracks()[0].addEventListener('unmute', () => {
    //       DumpEvent('un_muted:remoteCopy')
    //     });

    //     clonedStream = remoteStreamCopy.clone();

    //     clonedStream.getAudioTracks()[0].addEventListener('mute', () => {
    //       DumpEvent('muted:clonedStream')
    //     })
    //     clonedStream.getAudioTracks()[0].addEventListener('unmute', () => {
    //       DumpEvent('unmute:clonedStream')
    //     })

    //     remoteVideo.srcObject = remoteStreamCopy;

    //     cloneVideo.srcObject = clonedStream;
    //   }
    // };

    // if (senderCall) {
    //   combinedStream.getTracks().forEach(track => pc.addTrack(track, combinedStream));
    // }

    // Add audio tracks to the peer connection
    audioInput.getTracks().forEach((track) => pc.addTrack(track, audioInput));

    audioOutput.getTracks().forEach((track) => pc.addTrack(track, audioInput));

    return pc;
  };

  // Initialize audio devices
  useEffect(() => {
    // Grab initial audio devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const inputs = devices.filter((device) => device.kind === 'audioinput');
      const outputs = devices.filter((device) => device.kind === 'audiooutput');

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: inputs[0].deviceId,
          },
        })
        .then((stream) => {
          setAudioInput(stream);
        });

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: outputs[0].deviceId,
          },
        })
        .then((stream) => {
          setAudioOutput(stream);
        });
    });
  }, []);

  // Function for initiating an audio call
  const initiateAudioCall = async (newChannel: string) => {
    console.log(audioInput, audioOutput);
    // Check for error states
    if (audioInput === undefined || audioOutput === undefined) {
      throw Error("Can't get in new call, already in call.");
    }

    if (socket !== undefined) {
      throw Error("Can't get in new call, already in call.");
    }

    console.log('Initiating Call');

    // Initiate web socket for signaller
    const webSocketPrefix = SessionState.getInstance().serverURL.includes(
      'https',
    )
      ? 'wss'
      : 'ws';
    const newSocket = new WebSocket(
      `${webSocketPrefix}://${SessionState.getInstance().serverURL.split('//')[1]}/rooms/${roomID}/voice/${newChannel}?token=${SessionState.getInstance().sessionToken}&userid=${SessionState.getInstance().currentUser.username}`,
    );

    // Handle events from server
    newSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'join') {
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
      } else if (message.type === 'offer') {
        if (peerConnections.has(message.username)) {
          console.error(
            'Someone who already has a connection to you wants to make another.',
          );
          return;
        }

        const pc = createPeerConnection();
        await pc.setRemoteDescription(message.sdp);

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
        if (!peerConnections.has(message.username)) {
          console.error('Someone answered a non existent offer.');
          return;
        }

        const pc = peerConnections.get(message.username);
        if (pc === undefined) throw Error('Unreachable');
        await pc.setRemoteDescription(message.sdp);
      } else if (message.type === 'candidate') {
        if (!peerConnections.has(message.username)) {
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
      if (e.code !== 0) {
        console.error(e.reason);
      }

      setSocket(undefined);
      setChannel(undefined);
    };

    newSocket.onopen = async () => {
      console.log('Socket OPEN');

      // Broadcast join so others can send offers
      newSocket.send(JSON.stringify({ type: 'join' }));

      setChannel(newChannel);
      setSocket(newSocket);
    };
  };

  const closeAudioCall = useCallback(async () => {
    if (socket === undefined || channel === undefined) return;
    console.log('Closing Call');

    socket.close();
    setPeerConnections(new Map());
  }, [channel, socket]);

  // Call on unload to close any call that exists
  useEffect(() => {
    return () => {
      closeAudioCall();
    };
  }, [closeAudioCall]);

  return {
    setAudioInput,
    setAudioOutput,
    initiateAudioCall,
    closeAudioCall,
  };
}
