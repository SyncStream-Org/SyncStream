import { Router, Application } from "express";
import expressWs from "express-ws";
import wsDoc from "./controllers/doc";
import wsAudioCalls from "./controllers/audioCalls";
import wsVideoStreams from "./controllers/videoStreams";
import { wsAuth, wsPresence } from "./wsMiddleware";

const routerWs = Router();
expressWs(routerWs as unknown as Application);

routerWs.ws("/rooms/:roomID/doc/:docID", wsAuth, wsPresence, wsDoc);
routerWs.ws("/rooms/:roomID/voice/:channel", wsAuth, wsPresence, wsAudioCalls);
routerWs.ws(
  "/rooms/:roomID/stream/:channel",
  wsAuth,
  wsPresence,
  wsVideoStreams,
);

export default routerWs;
