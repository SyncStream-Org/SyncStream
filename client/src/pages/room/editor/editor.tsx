import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Types } from 'syncstream-sharedlib';
import { LinkBubbleMenu } from '@/components/ui/minimal-tiptap/components/bubble-menu/link-bubble-menu';
import { cn } from '@/utilities/utils';
import { useMinimalTiptapEditor } from '@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap';
import { EditorContent } from '@tiptap/react';
import { MeasuredContainer } from '@/components/ui/minimal-tiptap/components/measured-container';
import { Toolbar } from './toolbar';
import '@/components/ui/minimal-tiptap/styles/index.css';
import './editor.css';

const COLORS = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
];

interface User {
  name: string;
  color: string;
}

interface EditorProps {
  username: string;
  sessionToken: string;
  activeDoc: Types.MediaData | null;
  roomID: string;
  serverURL: string;
}

export default function DocumentEditor({
  username,
  sessionToken,
  activeDoc,
  roomID,
  serverURL,
}: EditorProps) {
  const [status, setStatus] = useState('connecting');
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  const [userColor] = useState(
    COLORS[Math.floor(Math.random() * COLORS.length)],
  );

  const [otherUsers, setOtherUsers] = useState<User[]>([]);

  useEffect(() => {
    console.log('yjs rerenders');
    if (!activeDoc) {
      return () => {};
    }
    const webSocketPrefix = serverURL.includes('https') ? 'wss' : 'ws';
    const wsURL = `${webSocketPrefix}://${serverURL.split('//')[1]}/rooms/${roomID}/doc`;

    const doc = new Y.Doc();
    setYdoc(doc);

    const websocketProvider = new WebsocketProvider(
      wsURL,
      activeDoc.mediaID!,
      doc,
      {
        params: { token: sessionToken },
      },
    );

    websocketProvider.on('status', (event: { status: string }) => {
      setStatus(event.status);
    });

    websocketProvider.on('connection-close', (CloseEvent) => {
      if (CloseEvent?.code === 1008) {
        websocketProvider.shouldConnect = false;
      }
    });

    websocketProvider.awareness.on('update', () => {
      const awarenessStates = websocketProvider.awareness.getStates();
      const newUsers = [];

      for (const [clientID, awareness] of awarenessStates) {
        if (clientID !== websocketProvider.awareness.clientID) {
          newUsers.push(awareness.user);
        }
      }
      setOtherUsers(newUsers);
    });

    websocketProvider.awareness.setLocalStateField('user', {
      name: username,
      color: userColor,
    });

    setProvider(websocketProvider);

    return () => {
      websocketProvider.disconnect();
      doc.destroy();
      setYdoc(null);
      setProvider(null);
    };
  }, [username, roomID, activeDoc, userColor, serverURL, sessionToken]);

  const editor = useMinimalTiptapEditor({
    ydoc,
    provider,
    placeholder: '',
    username,
    color: userColor,
    throttleDelay: 2000,
    output: 'html',
    editorClassName: 'focus:outline-none px-5 py-4 h-full',
  });

  if (!editor || !ydoc || !provider) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Select a Document To Begin Editing</p>
      </div>
    );
  }

  // TODO: localize
  // className="w-full mx-auto"
  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {otherUsers.map((user) => (
              <div key={user.name} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-xs">{user.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: status === 'connected' ? '#4caf50' : '#ff9800',
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {status === 'connected' ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {' '}
        {/* Add this wrapper */}
        <MeasuredContainer
          as="div"
          name="editor"
          className={cn(
            'flex flex-col shadow-sm focus-within:border-primary',
            'h-full w-full rounded-xl overflow-hidden',
          )}
          style={{
            maxWidth: '100%', // Ensures it never exceeds parent width
          }}
        >
          <Toolbar editor={editor} />
          <LinkBubbleMenu editor={editor} />
          <EditorContent
            editor={editor}
            className={cn(
              'minimal-tiptap-editor',
              'focus:outline-none px-5 py-4 flex-1 overflow-y-auto overflow-x-hidden',
            )}
            style={{
              maxWidth: '100%',
              width: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              // Force horizontal constraints to match container
              boxSizing: 'border-box',
            }}
          />
        </MeasuredContainer>
      </div>
    </div>
  );
}
