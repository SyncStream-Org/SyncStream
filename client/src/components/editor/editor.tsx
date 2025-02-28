import { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Placeholder from '@tiptap/extension-placeholder';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Loader2 } from 'lucide-react';

import { Toolbar } from '../toolbar/toolbar';
import './editor.css';
// Random user colors for collaboration cursors
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

export default function DocumentEditor() {
  const [status, setStatus] = useState('connecting');
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [username] = useState(`User ${Math.floor(Math.random() * 1000)}`);

  const [userColor] = useState(
    COLORS[Math.floor(Math.random() * COLORS.length)],
  );

  const [otherUsers, setOtherUsers] = useState<User[]>([]);

  useEffect(() => {
    const doc = new Y.Doc();
    setYdoc(doc);

    const websocketProvider = new WebsocketProvider(
      'ws://localhost/rooms/1/doc',
      'document-editor',
      doc,
    );

    websocketProvider.on('status', (event: { status: string }) => {
      setStatus(event.status);
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
  }, [username, userColor]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          // history: false,
        }),
        Placeholder.configure({
          placeholder: 'Start writing your document...',
        }),
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
            'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[450px] p-4',
        },
      },
    },
    [ydoc, provider],
  );

  if (!editor || !ydoc || !provider) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Collaborative Document Editor</h2>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: status === 'connected' ? '#4caf50' : '#ff9800',
              }}
            />
            <span className="text-sm text-gray-600">
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
      <div className="border-t">
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
