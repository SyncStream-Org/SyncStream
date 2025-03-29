import { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Types } from 'syncstream-sharedlib';
import { Toolbar } from './toolbar';
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
  activeDoc: Types.FileData | null;
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
    if (!activeDoc) {
      return () => {};
    }
    const webSocketPrefix = serverURL.includes('https') ? 'wss' : 'ws';
    const wsURL = `${webSocketPrefix}://${serverURL.split('//')[1]}/rooms/${roomID}/doc`;

    const doc = new Y.Doc();
    setYdoc(doc);

    const websocketProvider = new WebsocketProvider(
      wsURL,
      activeDoc.fileID!,
      doc,
      {
        params: { token: sessionToken },
      },
    );

    websocketProvider.on('status', (event: { status: string }) => {
      setStatus(event.status);
    });

    websocketProvider.on('connection-close', (CloseEvent) => {
      console.log('Connection closed:', CloseEvent);
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
    };
  }, [username, roomID, activeDoc, userColor, serverURL, sessionToken]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        ...(ydoc
          ? [
              Collaboration.configure({
                document: ydoc,
              }),
              CollaborationCursor.configure({
                provider,
                user: {
                  name: username,
                  color: userColor,
                },
              }),
            ]
          : []),
      ],
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[450px] p-4 dark:prose-invert',
        },
      },
    },
    [ydoc, provider],
  );

  if (!editor || !ydoc || !provider) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Select a Document To Begin Editing</p>
      </div>
    );
  }

  // TODO: localize

  return (
    <div className="editor-container w-full mx-auto overflow-hidden">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{activeDoc?.fileName}</h2>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: status === 'connected' ? '#4caf50' : '#ff9800',
              }}
            />
            <span className="text-sm text-gray-600  dark:text-gray-300">
              {status === 'connected' ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          {otherUsers.map((user, _) => (
            <div key={user.name} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Toolbar editor={editor} />
      <div className="editor-content no-scrollbar">
        {editor && (
          <>
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="flex items-center gap-1 rounded-md border bg-white p-1 shadow-md">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                >
                  <span className="italic">I</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-1 rounded ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
                >
                  <span className="font-mono">{'<>'}</span>
                </button>
              </div>
            </BubbleMenu>
            <EditorContent editor={editor} />
          </>
        )}
      </div>
    </div>
  );
}
