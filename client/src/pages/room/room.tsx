import { useState, useEffect, useCallback } from 'react';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import { Separator } from '@/components/ui/separator';
import { useRoomSSE } from '@/api/routes/useRoomSse';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';
import { RoomHeader } from './room-header';
import { RoomHome } from './room-home/room-home';
import * as api from '../../api';
import RoomSettings from './room-settings/room-settings';
import { Button } from '@/components/ui/button';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  navigate: NavigateFunction;
}

function RoomPage(props: Props) {
  const room = useLocation().state?.room as Types.RoomData | undefined;
  const [media, setMedia] = useState<Types.MediaData[]>([]);
  const [activeDoc, setActiveDoc] = useState<Types.MediaData | null>(null);
  const [activeStream, setActiveStream] = useState<Types.MediaData | null>(
    null,
  );
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [activeVoice, setActiveVoice] = useState<Types.MediaData | null>(null);

  // Web RTC Voice Calling
  const [currentAudioInput, setCurrentAudioInput] = useState<
    MediaStream | undefined
  >(undefined);
  const [currentAudioOutput, setCurrentAudioOutput] = useState<
    MediaStream | undefined
  >(undefined);
  const [currentVoiceCallChannel, setCurrentVoiceCallChannel] = useState<
    String | undefined
  >(undefined);
  const [currentVoiceCall, setCurrentVoiceCall] = useState<
    RTCPeerConnection | undefined
  >(undefined);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  // Call on unload
  useEffect(() => {
    return () => {
      if (socket !== undefined) {
        socket.close();
      }
    };
  }, [socket]);

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
          setCurrentAudioInput(stream);
        });

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: outputs[0].deviceId,
          },
        })
        .then((stream) => {
          setCurrentAudioOutput(stream);
        });
    });
  }, []);

  const initiateAudioCall = async (channel: string) => {
    console.log(currentAudioInput, currentAudioOutput, currentVoiceCall);
    if (
      currentAudioInput === undefined ||
      currentAudioOutput === undefined ||
      currentVoiceCallChannel !== undefined
    )
      return;

    console.log('Initiating Call');

    // Initiate web socket for signaller
    const webSocketPrefix = SessionState.getInstance().serverURL.includes(
      'https',
    )
      ? 'wss'
      : 'ws';
    const newSocket = new WebSocket(
      `${webSocketPrefix}://${SessionState.getInstance().serverURL.split('//')[1]}/rooms/${room?.roomID}/voice/${currentVoiceCallChannel}?token=${SessionState.getInstance().sessionToken}&userid=${SessionState.getInstance().currentUser.username}`,
    );

    newSocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'offer' && currentVoiceCall) {
        await currentVoiceCall.setRemoteDescription(
          new RTCSessionDescription(message.offer),
        );
        const answer = await currentVoiceCall.createAnswer();
        await currentVoiceCall.setLocalDescription(answer);
        newSocket.send(JSON.stringify({ type: 'answer', answer }));
      } else if (message.type === 'answer' && currentVoiceCall) {
        await currentVoiceCall.setRemoteDescription(
          new RTCSessionDescription(message.answer),
        );
      } else if (message.type === 'candidate' && currentVoiceCall) {
        await currentVoiceCall.addIceCandidate(
          new RTCIceCandidate(message.candidate),
        );
      }
    };

    newSocket.onclose = () => setSocket(undefined);

    newSocket.onopen = async () => {
      console.log('Socket OPEN');

      // Create the connection
      const peerConnection = new RTCPeerConnection();

      // Add audio tracks to the peer connection
      currentAudioInput
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, currentAudioInput));

      currentAudioOutput
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, currentAudioOutput));

      // ICE candidate handling
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          newSocket.send(
            JSON.stringify({ type: 'candidate', candidate: event.candidate }),
          );
        }
      };

      // Send offer to signaling server
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      newSocket.send(JSON.stringify({ type: 'offer', offer }));

      console.log(peerConnection, newSocket);

      setCurrentVoiceCall(peerConnection);
      setCurrentVoiceCallChannel(channel);
      setSocket(newSocket);
    };
  };

  const handleRoomFetch = () => {
    api.Media.getAllRoomMedia(room?.roomID!).then(({ success, data }) => {
      if (success === api.SuccessState.SUCCESS) {
        setMedia(data!);
      } else {
        console.error('Error fetching files:', data);
      }
    });
  };

  const handleHomeClick = () => {
    // clear active stream and active doc
    setActiveStream(null);
    setActiveDoc(null);
    setSettingsOpen(false);
  };

  const handleSettingsClick = () => {
    // clear active stream and active doc
    setActiveStream(null);
    setActiveDoc(null);
    setSettingsOpen(true);
  };

  const onMediaUpdate = useCallback(
    (type: Types.UpdateType, update: Types.MediaData) => {
      setMedia((prevMedia) => {
        switch (type) {
          case 'update':
            return prevMedia.map((file) =>
              file.mediaID === update.mediaID ? update : file,
            );
          case 'delete':
            return prevMedia.filter((file) => file.mediaID !== update.mediaID);
          case 'create':
            return [...prevMedia, update];
          default:
            return prevMedia;
        }
      });
    },
    [],
  );

  useRoomSSE(
    room?.roomID!,
    SessionState.getInstance().sessionToken,
    onMediaUpdate,
  );

  useEffect(() => {
    handleRoomFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <AppSidebar
          room={room!}
          username={SessionState.getInstance().currentUser.username}
          media={media}
          activeDoc={activeDoc}
          setActiveDoc={setActiveDoc}
          activeStream={activeStream}
          setActiveStream={setActiveStream}
          activeVoice={activeVoice}
          setActiveVoice={setActiveVoice}
          goToHome={() => {
            api.User.leaveRoomPresence();
            props.navigate('/home');
          }}
          goToSettings={() => {
            props.navigate('/settings');
          }}
          setRoomHome={handleHomeClick}
          setRoomSettings={handleSettingsClick}
        />
        {/* Main Content */}
        {/* Text Editor */}
        <SidebarInset>
          <RoomHeader
            roomHome={activeDoc === null && activeStream === null}
            activeDoc={activeDoc}
            activeStream={activeStream}
          />
          <Separator />
          <div className="flex flex-1 flex-col pt-0 overflow-hidden">
            {activeDoc !== null && settingsOpen !== true && (
              <DocEditor
                activeDoc={activeDoc}
                username={SessionState.getInstance().currentUser.username}
                sessionToken={SessionState.getInstance().sessionToken}
                roomID={room?.roomID!}
                serverURL={SessionState.getInstance().serverURL}
              />
            )}
            {activeDoc === null &&
              activeStream === null &&
              settingsOpen === false && (
                <RoomHome
                  media={media}
                  roomID={room?.roomID!}
                  refresh={handleRoomFetch}
                  setActiveDoc={setActiveDoc}
                  setActiveStream={setActiveStream}
                  setActiveVoice={setActiveVoice}
                />
              )}
            {settingsOpen === true && (
              <RoomSettings
                roomID={room?.roomID!}
                setAudioInStream={(stream) => {
                  setCurrentAudioInput(stream);
                }}
                setAudioOutStream={(stream) => {
                  setCurrentAudioOutput(stream);
                }}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Button
        onClick={() => {
          initiateAudioCall('test');
        }}
      >
        TEST CALL
      </Button>
    </div>
  );
}

export default asPage(RoomPage, false);
