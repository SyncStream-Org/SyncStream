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

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  navigate: NavigateFunction;
}

function RoomPage(props: Props) {
  const roomID = useParams<{ roomID: string }>().roomID!;
  const [media, setMedia] = useState<Types.FileData[]>([
    {
      fileId: '1',
      fileName: 'Document 1',
      fileExtension: 'doc',
      permissions: { canEdit: true },
    },
    {
      fileId: '2',
      fileName: 'Document 2',
      fileExtension: 'doc',
      permissions: { canEdit: false },
    },
    {
      fileId: '3',
      fileName: 'Stream 1',
      fileExtension: 'stream',
      permissions: { canEdit: true },
    },
    {
      fileId: '4',
      fileName: 'Stream 2',
      fileExtension: 'stream',
      permissions: { canEdit: false },
    },
    {
      fileId: '5',
      fileName: 'Voice Channel 1',
      fileExtension: 'voice',
      permissions: { canEdit: true },
    },
    {
      fileId: '6',
      fileName: 'Voice Channel 2',
      fileExtension: 'voice',
      permissions: { canEdit: false },
    },
  ]);
  const [activeDoc, setActiveDoc] = useState<Types.FileData | null>(null);
  const [activeStream, setActiveStream] = useState<Types.FileData | null>(null);
  const [activeVoice, setActiveVoice] = useState<Types.FileData | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
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
          roomName="Room Name"
          username={SessionState.getInstance().currentUser.username}
          media={media}
          activeDoc={activeDoc}
          setActiveDoc={setActiveDoc}
          activeStream={activeStream}
          setActiveStream={setActiveStream}
          activeVoice={activeVoice}
          setActiveVoice={setActiveVoice}
          updateMedia={(mediaID: string) => {}}
          deleteMedia={(mediaID: string) => {}}
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
        <SidebarInset className="bg-white dark:bg-gray-800">
          <RoomHeader
            roomHome={activeDoc === null && activeStream === null}
            activeDoc={activeDoc}
            activeStream={activeStream}
          />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 rounded shadow overflow-hidden">
            {activeDoc !== null && (
              <DocEditor
                activeDoc={activeDoc}
                username={SessionState.getInstance().currentUser.username}
                sessionToken=""
                roomID={roomID}
                serverURL={SessionState.getInstance().serverURL}
              />
            )}
            {/* {activeDoc === null && activeStream === null && (
              <RoomHome media={media} />
            )} */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default asPage(RoomPage);
