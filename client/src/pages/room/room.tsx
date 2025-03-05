import { useState, useEffect } from 'react';
import { useParams, NavigateFunction } from 'react-router-dom';
import SessionState from '../../utilities/session-state';
import DocEditor from './editor/editor';
import { asPage } from '../../utilities/page-wrapper';

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
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-4">Online Users</h2>
          <ul className="space-y-2">
            {onlineUsers.map((user) => (
              <li
                key={user}
                className="p-2 bg-white dark:bg-gray-700 rounded shadow flex items-center"
              >
                <img
                  src="https://placehold.co/40x40"
                  alt="User"
                  className="rounded-full"
                />
                <span className="ml-3">{user}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-6 mb-4">Files</h2>
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file}
                className={`p-2 rounded shadow cursor-pointer ${
                  docName === file
                    ? 'bg-blue-200 dark:bg-gray-600'
                    : 'bg-white dark:bg-gray-700'
                }`}
                onClick={() => setDocName(file)}
              >
                {file}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => props.navigate('/home')}
          className="mt-4 p-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Leave Room
        </button>
      </aside>

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
    </div>
  );
}

export default asPage(RoomPage);
