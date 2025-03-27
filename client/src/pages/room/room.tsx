import { useState, useEffect } from 'react';
import { useParams, NavigateFunction } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';
import { RoomHeader } from './room-header';
import { RoomHome } from './room-home/room-home';
import { Separator } from '@/components/ui/separator';
import * as api from '../../api';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  navigate: NavigateFunction;
}

function RoomPage(props: Props) {
  const roomID = useParams<{ roomID: string }>().roomID!;
  const [media, setMedia] = useState<Types.FileData[]>([]);
  const [activeDoc, setActiveDoc] = useState<Types.FileData | null>(null);
  const [activeStream, setActiveStream] = useState<Types.FileData | null>(null);
  const [activeVoice, setActiveVoice] = useState<Types.FileData | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [room, setRoom] = useState<Types.RoomData | null>(null);

  const handleRoomFetch = () => {
    api.Files.getAllRoomFiles(roomID).then(({ success, data }) => {
      if (success === api.SuccessState.SUCCESS) {
        setMedia(data!);
      } else {
        console.error('Error fetching files:', data);
      }
    });
  }

  useEffect(() => {
    // TODO: Fetch room data from the server
    setRoom({roomName: 'Room Name', roomID: roomID});
    handleRoomFetch();
    const handleUnload = (event: BeforeUnloadEvent) => {
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
          setRoomHome={() => {}}
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
                sessionToken=""
                roomID={roomID}
                serverURL={SessionState.getInstance().serverURL}
              />
            )}
            {activeDoc === null && activeStream === null && (
              <RoomHome media={media} roomID={roomID} refresh={handleRoomFetch} />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default asPage(RoomPage);
