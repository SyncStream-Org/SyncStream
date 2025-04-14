import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Types } from 'syncstream-sharedlib';
import { MeasuredContainer } from '@/components/ui/minimal-tiptap/components/measured-container';
import { LinkBubbleMenu } from '@/components/ui/minimal-tiptap/components/bubble-menu/link-bubble-menu';
import { cn } from '@/utilities/utils';
import { useMinimalTiptapEditor } from '@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap';
import { EditorContent } from '@tiptap/react';
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

  const editor = useMinimalTiptapEditor({
    ydoc,
    provider,
    placeholder: 'Start typing...',
    username,
    color: userColor,
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
    <div>
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{activeDoc?.mediaName}</h2>
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
      <MeasuredContainer
        as="div"
        name="editor"
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={cn('minimal-tiptap-editor')}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
      {/* <div className="editor-content no-scrollbar w-full">
        {editor && (
          <>
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="flex items-center gap-1 rounded-md border bg-white p-1 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                >
                  <span className="italic">I</span>
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-1 rounded ${editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                >
                  <span className="font-mono">{'<>'}</span>
                </button>
              </div>
            </BubbleMenu>
            <EditorContent
              editor={editor}
              className="w-full border rounded-md overflow-hidden break-words [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-1 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_*]:max-w-full [&_pre]:whitespace-pre-wrap [&_code]:whitespace-pre-wrap"
            />
          </>
        )}
      </div> */}
    </div>
  );
}
