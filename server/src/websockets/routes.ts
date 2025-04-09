import { Router, Application } from "express";
import expressWs from "express-ws";
import wsDoc from "./controllers/doc";
import wsAudioCalls from "./controllers/audioCalls";
import { wsAuth, wsPresence } from "./wsMiddleware";

const routerWs = Router();
expressWs(routerWs as unknown as Application);

routerWs.ws("/rooms/:roomID/doc/:docID", wsAuth, wsPresence, wsDoc);
routerWs.ws("/rooms/:roomID/audioCalls", wsAuth, wsAudioCalls);

export default routerWs;
