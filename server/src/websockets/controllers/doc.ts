import { Request } from 'express';
import { WebSocket } from 'ws';
import * as Y from 'yjs';
// @ts-expect-error - no types available
import { setupWSConnection, docs, setPersistence, setContentInitializor } from '../../../node_modules/y-websocket/bin/utils.cjs';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.env.USER_FILES;

const persistence = {
  bindState: (docName: string, ydoc: Y.Doc) => {
  },
  writeState: async (docName: string, ydoc: Y.Doc) => {
    const resolvedPath = path.resolve(ROOT_DIR!, docName);
    if (!resolvedPath.startsWith(ROOT_DIR!)) {
      throw new Error('Invalid docName');
    }
    console.log('Writing state for:', docName);
    const file = Y.encodeStateAsUpdate(ydoc);
    fs.writeFileSync(resolvedPath, file); // Save state as JSON
  }
};

setPersistence(persistence);

const initContent = (ydoc: Y.Doc, docName: string) => {
  const resolvedPath = path.resolve(ROOT_DIR!, docName);
  if (!resolvedPath.startsWith(ROOT_DIR!)) {
    throw new Error('Invalid docName');
  }
  if (fs.existsSync(resolvedPath)) {
    const file = fs.readFileSync(resolvedPath);
    try {
      Y.applyUpdate(ydoc, file);
    } catch (error) {
      console.error('Error parsing file content:', error);
    }
  }
};

export default function wsDoc (ws: WebSocket, req: Request) {
  const docName = req.params.roomID.toString() + '-' + req.params.docID;

  if (!docs.has(docName)) {
    setContentInitializor((ydoc: Y.Doc) => initContent(ydoc, docName));
  }

  setupWSConnection(ws, undefined, { docName });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed on /doc');
  });
}