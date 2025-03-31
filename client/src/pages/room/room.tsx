import { useState, useEffect } from 'react';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import { Separator } from '@/components/ui/separator';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';
import { RoomHeader } from './room-header';
import { RoomHome } from './room-home/room-home';
import * as api from '../../api';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  navigate: NavigateFunction;
}

function RoomPage(props: Props) {
  const room = useLocation().state?.room as Types.RoomData | undefined;
  const [media, setMedia] = useState<Types.FileData[]>([]);
  const [activeDoc, setActiveDoc] = useState<Types.FileData | null>(null);
  const [activeStream, setActiveStream] = useState<Types.FileData | null>(null);
  const [activeVoice, setActiveVoice] = useState<Types.FileData | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

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
  };

  // TODO: Update when merged with home page
  // useEffect(() => {
  //   api.Rooms.createRoom('Room Name').then(({ success, data }) => {
  //     if (success === api.SuccessState.SUCCESS) {
  //       console.log('Room created:', data);
  //       setRoom({ roomName: 'Room Name', roomID: data?.roomID });
  //     } else {
  //       console.error('Error creating room:', roomID);
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (room) {
      handleRoomFetch();
    }
  }, [room]);

  useEffect(() => {
    const handleUnload = (event: BeforeUnloadEvent) => {
      api.User.leaveRoomPresence();
      if (!sessionSaved) {
        event.preventDefault();
        SessionState.getInstance()
          .saveCache()
          .then(() => {
            setSessionSaved(true);
            window.electron.ipcRenderer.sendMessage('app-quit');
          });
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionSaved]);

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
            props.navigate('/home');
          }}
          goToSettings={() => {
            props.navigate('/settings');
          }}
          setRoomHome={handleHomeClick}
          setRoomSettings={() => {}}
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
            {activeDoc !== null && (
              <DocEditor
                activeDoc={activeDoc}
                username={SessionState.getInstance().currentUser.username}
                sessionToken={SessionState.getInstance().sessionToken}
                roomID={room?.roomID!}
                serverURL={SessionState.getInstance().serverURL}
              />
            )}
            {activeDoc === null && activeStream === null && (
              <RoomHome
                media={media}
                roomID={room?.roomID!}
                refresh={handleRoomFetch}
                setActiveDoc={setActiveDoc}
                setActiveStream={setActiveStream}
                setActiveVoice={setActiveVoice}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default asPage(RoomPage);
