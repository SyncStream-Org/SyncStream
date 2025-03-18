import { useState, useEffect } from 'react';
import { useParams, NavigateFunction } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';
import { RoomSidebar } from './sidebar/sidebar';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  navigate: NavigateFunction;
}

function RoomPage(props: Props) {
  const roomID = useParams<{ roomID: string }>().roomID!;
  const [onlineUsers, setOnlineUsers] = useState(['Alice', 'Bob', 'Charlie']);
  const [files, setFiles] = useState([
    'Document1.txt',
    'Notes.md',
    'Project.pdf',
  ]);
  const [docName, setDocName] = useState<string | null>(null);
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
        <RoomSidebar />
        {/* Main Content */}
        <main className="flex-1 p-4 flex flex-col">
          {/* Text Editor */}
          <div
            className="flex-1 bg-white dark:bg-gray-800 rounded shadow p-4 overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            <DocEditor
              docName={docName === null ? '' : docName}
              username={SessionState.getInstance().currentUser.username}
              sessionToken=""
              roomID={roomID}
              serverURL={SessionState.getInstance().serverURL}
            />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default asPage(RoomPage);
