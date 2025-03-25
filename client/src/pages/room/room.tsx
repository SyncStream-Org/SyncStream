import { useState, useEffect } from 'react';
import { useParams, NavigateFunction } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Types } from 'syncstream-sharedlib';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { AppSidebar } from './sidebar/app-sidebar';

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
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<string | null>(null);
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
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
        <main className="flex-1 p-4 flex flex-col">
          {/* Text Editor */}
          <SidebarTrigger />
          <div
            className="flex-1 bg-white dark:bg-gray-800 rounded shadow p-4 overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {activeDoc !== null && (
              <DocEditor
                docName={activeDoc === null ? '' : activeDoc}
                username={SessionState.getInstance().currentUser.username}
                sessionToken=""
                roomID={roomID}
                serverURL={SessionState.getInstance().serverURL}
              />
            )}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default asPage(RoomPage);
