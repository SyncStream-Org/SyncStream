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
import {
  closeVideoCall,
  initiateVideoCall,
  useWebRTCVideo,
} from '@/api/routes/useWebRTCVideo';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';
import { RoomHeader } from './room-header';
import { RoomHome } from './room-home/room-home';
import { VoiceChannelCard } from './voiceChannelCard';
import * as api from '../../api';
import RoomSettings from './room-settings/room-settings';
import { StreamViewer } from './stream-viewer/streamViewer';

interface PresenceData {
  users: string[];
  isServerSet?: boolean;
}

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
  const [presenceMap, setPresenceMap] = useState<Map<string, PresenceData>>(
    new Map<string, PresenceData>(),
  );

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

  const handleActiveDoc = (doc: Types.MediaData | null) => {
    setActiveDoc(doc);
    setActiveStream(null);
    setSettingsOpen(false);
  };

  const handleActiveStream = (stream: Types.MediaData | null) => {
    setActiveStream(stream);
    setActiveDoc(null);
    setSettingsOpen(false);
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
      if (type === 'update') {
        // keep master list of room users. update here.
      } else if (
        type === 'delete' &&
        SessionState.getInstance().currentUser.username === update.username
      ) {
        api.User.leaveRoomPresence();
        props.navigate('/home');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onPresenceUpdate = useCallback(
    (type: Types.UpdateType, update: Types.PresenceData) => {
      if (type === 'create') {
        setPresenceMap((prevMap) => {
          const newMap = new Map(prevMap);
          const prevEntry = newMap.get(update.mediaID);
          if (prevEntry) {
            newMap.set(update.mediaID, {
              users: [
                ...prevEntry.users,
                update.username,
              ],
              isServerSet: update.isServer === true ? true : prevEntry.isServerSet,
            });
          } else {
            newMap.set(update.mediaID, {
              users: [update.username],
              isServerSet: update.isServer,
            });
          }
          return newMap;
        });
      } else if (type === 'delete') {
        setPresenceMap((prevMap) => {
          const newMap = new Map(prevMap);
          const prevEntry = newMap.get(update.mediaID);
          if (prevEntry) {
            newMap.set(update.mediaID, {
              users: prevEntry.users.filter((user) => user !== update.username),
              isServerSet: update.isServer === true ? false : prevEntry.isServerSet,
            });
          }
          if (newMap.get(update.mediaID)?.users.length === 0) {
            newMap.delete(update.mediaID);
          }
          if (update.isServer === true && activeStream?.mediaID === update.mediaID) {
            setActiveStream(null);
          }
          return newMap;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

  useRoomSSE(
    room?.roomID!,
    SessionState.getInstance().sessionToken,
    onMediaUpdate,
    onRoomUpdate,
    onUserUpdate,
    onPresenceUpdate,
  );

  useEffect(() => {
    handleRoomFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (activeVoice) {
      initiateAudioCall(room?.roomID!, activeVoice.mediaID!);
    } else {
      closeAudioCall();
    }
  }, [activeVoice, room?.roomID]);

  useEffect(() => {
    console.log(presenceMap);
  }, [presenceMap]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarProvider>
        <AppSidebar
          room={room!}
          username={SessionState.getInstance().currentUser.username}
          media={media}
          activeDoc={activeDoc}
          setActiveDoc={handleActiveDoc}
          activeStream={activeStream}
          setActiveStream={handleActiveStream}
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
            roomHome={
              activeDoc === null &&
              activeStream === null &&
              settingsOpen === false
            }
            activeDoc={activeDoc}
            activeStream={activeStream}
          />
          <Separator />
          <div className="flex flex-1 flex-col pt-0 overflow-hidden">
            {activeDoc !== null && (
              <DocEditor
                activeDoc={activeDoc}
                username={SessionState.getInstance().currentUser.username}
                sessionToken={SessionState.getInstance().sessionToken}
                roomID={room?.roomID!}
                serverURL={SessionState.getInstance().serverURL}
              />
            )}
            {activeStream !== null && settingsOpen !== true && (
              <StreamViewer
                activeStream={activeStream}
                presenceData={presenceMap.get(activeStream.mediaID!)}
                roomID={room?.roomID!}
              />
            )}
            {activeDoc === null &&
              activeStream === null &&
              settingsOpen === false && (
                <RoomHome
                  media={media}
                  roomID={room?.roomID!}
                  refresh={handleRoomFetch}
                  setActiveDoc={handleActiveDoc}
                  setActiveStream={handleActiveStream}
                  setActiveVoice={setActiveVoice}
                />
              )}
            {settingsOpen === true && <RoomSettings room={room!} />}
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
      <audio id="remoteAudioPlayer" autoPlay hidden>
        <track kind="captions" src="" label="English captions" hidden />
      </audio>
    </div>
  );
}

export default asPage(RoomPage, false);
