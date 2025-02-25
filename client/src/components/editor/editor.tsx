import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from 'y-prosemirror';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { schema } from 'prosemirror-schema-basic';
import './editor.css';

function ProsemirrorEditor({ roomName = 'prosemirror' }): React.JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const prosemirrorViewRef = useRef<EditorView | null>(null);
  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = ydocRef.current;
    const provider = new WebsocketProvider(
      'ws://localhost/rooms/1/',
      roomName,
      ydoc,
    );
    providerRef.current = provider;

    const type = ydoc.getXmlFragment('prosemirror');

    const state = EditorState.create({
      schema,
      plugins: [
        ySyncPlugin(type),
        yCursorPlugin(provider.awareness),
        yUndoPlugin(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo,
        }),
      ],
    });

    if (editorRef.current) {
      const view = new EditorView(editorRef.current, {
        state,
      });

      prosemirrorViewRef.current = view;
    }

    return () => {
      if (prosemirrorViewRef.current) {
        prosemirrorViewRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      ydoc.destroy();
    };
  }, [roomName]);

  return <div ref={editorRef} id="editor" />;
}

export default ProsemirrorEditor;
