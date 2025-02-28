import { Router, Request, Application } from 'express';
import { WebSocket } from 'ws';
import expressWs from 'express-ws';
import * as Y from 'yjs';

// @ts-expect-error - no types available
import { setupWSConnection, docs, setPersistence, setContentInitializor } from '../../node_modules/y-websocket/bin/utils.cjs';
const routerWs = Router();
expressWs(routerWs as unknown as Application);

const docCounts = new Map<string, number>();

routerWs.ws('/rooms/:roomID/doc/:docName', (ws: WebSocket, req: Request) => {
  const persistence = {
    bindState: (docName: string, ydoc: Y.Doc) => {
      console.log('Binding state');
    },
    writeState: async (docName: string, ydoc: Y.Doc) => {
      console.log('Writing state');
    }
  }
  
  const initContent = (ydoc: Y.Doc) => {
    console.log('Initializing content');
    ydoc.getMap('position').set(username, docCount);
    const watch = ydoc.getXmlFragment('default');
    const paragraph = new Y.XmlElement('paragraph');
    paragraph.insert(0, [new Y.XmlText('This is a new paragraph.\n')]);
    watch.insert(0, [paragraph]);
    watch.observeDeep(() => {
      console.log(watch.toString());
    });
  }

  const roomName = req.params.roomID.toString() + '-' + req.params.docName;

  docCounts.set(roomName, docCounts.get(roomName) ? docCounts.get(roomName)! + 1 : 0);
  const docCount = docCounts.get(roomName);

  setPersistence(persistence);
  setContentInitializor(initContent);

  setupWSConnection(ws, roomName, { docName: roomName });
  
  ws.on('close', () => {
    docCounts.set(roomName, docCounts.get(roomName)! - 1);
    console.log('WebSocket connection closed on /doc');
    console.log(docs);
  });
});

export default routerWs;