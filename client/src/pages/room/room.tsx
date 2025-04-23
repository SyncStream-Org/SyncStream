import { useState, useEffect, useCallback } from 'react';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import { Separator } from '@/components/ui/separator';
import { useRoomSSE } from '@/api/routes/useRoomSse';
import {
  closeAudioCall,
  initiateAudioCall,
  useWebRTCAudio,
  toggleMute,
} from '@/api/routes/useWebRTCAudio';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';
import { RoomHeader } from './room-header';
import { RoomHome } from './room-home/room-home';
import { VoiceChannelCard } from './voiceChannelCard';
import * as api from '../../api';
import RoomSettings from './room-settings/room-settings';

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
  const [usersInRoom, setUsersInRoom] = useState<Types.RoomsUserData[]>([]);
  const [usersNotInRoom, setUsersNotInRoom] = useState<Types.UserData[]>([]);

  // Get webRTC connections
  const userAudioData = useWebRTCAudio();

  const handleRoomFetch = () => {
    api.Media.getAllRoomMedia(room?.roomID!).then(({ success, data }) => {
      if (success === api.SuccessState.SUCCESS) {
        setMedia(data!);
      } else {
        console.error('Error fetching files:', data);
      }
    });
  };

  const handleUserFetch = () => {
    api.User.getAllUsers().then(async (res1) => {
      if (res1.success !== api.SuccessState.SUCCESS) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message:
            'Something went wrong with the server and we could not grab username data.',
        });
      } else {
        api.Rooms.listMembers(room!.roomID!).then(async (res2) => {
          if (res2.success !== api.SuccessState.SUCCESS) {
            window.electron.ipcRenderer.invokeFunction('show-message-box', {
              title: 'Error',
              message:
                'Something went wrong with the server and we could not grab room member data.',
            });
          } else {
            if (
              res1 === undefined ||
              res1.data === undefined ||
              res2 === undefined ||
              res2.data === undefined
            )
              throw Error('Unreachable');
            const usersInRoomRes = res2.data;
            const usersNotInRoomRes = res1.data.filter(
              (user) =>
                !usersInRoomRes
                  .map((roomUser) => roomUser.username)
                  .includes(user.username),
            );
            const usersInRoomFiltered = usersInRoomRes.filter((user) => {
              // Check if the user is in the room and not the current user
              return (
                user.username !==
                SessionState.getInstance().currentUser.username
              );
            });
            setUsersInRoom(usersInRoomFiltered);
            setUsersNotInRoom(usersNotInRoomRes);
          }
        });
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

  const onRoomUpdate = useCallback(
    (type: Types.UpdateType, update: Types.RoomUpdateData) => {
      if (type === 'update') {
        if (update.newRoomName) {
          room!.roomName = update.newRoomName;
        }
        if (update.newOwnerID) {
          room!.roomOwner = update.newOwnerID;
        }
      } else if (type === 'delete') {
        api.User.leaveRoomPresence();
        props.navigate('/home');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onUserUpdate = useCallback(
    (type: Types.UpdateType, update: Types.RoomUserUpdateData) => {
      if (type === 'delete') {
        if (
          SessionState.getInstance().currentUser.username === update.username
        ) {
          api.User.leaveRoomPresence();
          props.navigate('/home');
        }
      }
      if (room?.roomOwner === SessionState.getInstance().currentUser.username) {
        // not efficient at all, improve maybe
        handleUserFetch();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useRoomSSE(
    room?.roomID!,
    SessionState.getInstance().sessionToken,
    onMediaUpdate,
    onRoomUpdate,
    onUserUpdate,
  );

  useEffect(() => {
    handleRoomFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (
      room &&
      room.roomOwner! === SessionState.getInstance().currentUser.username
    ) {
      handleUserFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, settingsOpen]);

  useEffect(() => {
    if (activeVoice) {
      initiateAudioCall(room?.roomID!, activeVoice.mediaID!);
    } else {
      closeAudioCall();
    }
  }, [activeVoice, room?.roomID]);

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
                room={room!}
                usersInRoom={usersInRoom}
                usersNotInRoom={usersNotInRoom}
              />
            )}
          </div>
        </SidebarInset>
        <VoiceChannelCard
          callActive={!!activeVoice}
          channelName={activeVoice?.mediaName!}
          users={userAudioData}
          onMuteToggle={toggleMute}
          onLeaveCall={() => {
            closeAudioCall();
            setActiveVoice(null);
          }}
        />
      </SidebarProvider>
      <audio id="remoteAudioPlayer" autoPlay hidden />
    </div>
  );
}

export default asPage(RoomPage, false);
