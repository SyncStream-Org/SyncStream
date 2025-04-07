import { useState, useEffect, useCallback } from 'react';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import { Separator } from '@/components/ui/separator';
import { useSSE } from '@/api/routes/useSse';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';
import { RoomHeader } from './room-header';
import { RoomHome } from './room-home/room-home';
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
  const [media, setMedia] = useState<Types.FileData[]>([]);
  const [activeDoc, setActiveDoc] = useState<Types.FileData | null>(null);
  const [activeStream, setActiveStream] = useState<Types.FileData | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [activeVoice, setActiveVoice] = useState<Types.FileData | null>(null);

  const handleRoomFetch = () => {
    api.Files.getAllRoomFiles(room?.roomID!).then(({ success, data }) => {
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
    (type: Types.UpdateType, update: Types.FileData) => {
      setMedia((prevMedia) => {
        switch (type) {
          case 'update':
            return prevMedia.map((file) =>
              file.fileID === update.fileID ? update : file,
            );
          case 'delete':
            return prevMedia.filter((file) => file.fileID !== update.fileID);
          case 'create':
            return [...prevMedia, update];
          default:
            return prevMedia;
        }
      });
    },
    [],
  );

  useSSE(room?.roomID!, SessionState.getInstance().sessionToken, onMediaUpdate);

  useEffect(() => {
    handleRoomFetch();
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
            api.User.leaveRoomPresence();
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
            {settingsOpen === true && <RoomSettings roomID={room?.roomID!} />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default asPage(RoomPage, false);
