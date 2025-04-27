import { Request } from "express";
import { WebSocket } from "ws";
import { verifyToken } from "../utils/auth";
import userService from "../services/userService";
import PresenceState from "../utils/state";
import { Validation } from "syncstream-sharedlib";
import mediaService from "../services/mediaService";
import Broadcaster from "../utils/broadcaster";

export async function wsAuth(ws: WebSocket, req: Request, next: () => void) {
  const token = req.query.token as string;
  if (!token) {
    ws.close(1008, "Authentication token required");
    return;
  }

  try {
    const username = await verifyToken(token);

    const user = await userService.getUserByUsername(username);
    if (!user) {
      ws.close(1008, "User not found");
      return;
    }

    (req as any).user = user;

    next();
  } catch (error) {
    ws.close(1008, "Invalid token");
  }
}

export async function wsPresence(
  ws: WebSocket,
  req: Request,
  next: () => void,
) {
  const username = (req as any).user.username;
  const mediaType = req.url.split("/")[3];

  if (!Validation.isMediaType(mediaType)) {
    ws.close(1008, `Invalid media type: ${mediaType}`);
    return;
  }

  if (PresenceState.getUserEntry(username)?.roomID !== req.params.roomID) {
    ws.close(1008, `Not currenty in room: ${req.params.roomID}`);
    return;
  }

  if (PresenceState.getUserMedia(username, mediaType)) {
    ws.close(1008, `Media already set for ${mediaType}`);
    return;
  }

  const roomID = req.params.roomID;
  const mediaID = req.params.docID || req.params.channel;

  try {
    const mediaObject = await mediaService.getMediaByID(roomID, mediaID);
    if (mediaObject === null || mediaObject.mediaType !== mediaType) {
      ws.close(1008, 'Media not found');
      return
    }
  } catch {
    ws.close(1008, 'Invalid room/media ID');
    return;
  }

  // check if they belong to the room or are an admin
  const roomUser = await userService.getRoomUser(roomID, username);
  if ((!roomUser || !roomUser.isMember) && !(req as any).user.admin) {
    ws.close(1008, "User not found in room");
    return;
  }
  
  const isServer = req.query.isClient ? !((req.query.isClient as string) === "true") : undefined;
  
  if (PresenceState.checkIfServer(mediaID)) {
    Broadcaster.pushUpdateToRoom(roomID, {
      endpoint: "presence",
      type: "create",
      data: {
        username,
        mediaID,
        isServer: false,
      },
    });
    ws.close(1008, "FUCK OFF");
    return;
  }
  
  // broadcast the presence update
  Broadcaster.pushUpdateToRoom(roomID, {
    endpoint: "presence",
    type: "create",
    data: {
      username,
      mediaID,
      isServer,
    },
  });

  PresenceState.setUserMedia(username, mediaType, mediaID, isServer);

  ws.on("close", () => {
    PresenceState.clearUserMedia(username, mediaType);
    Broadcaster.pushUpdateToRoom(roomID, {
      endpoint: "presence",
      type: "delete",
      data: {
        username,
        mediaID,
        isServer,
      },
    });
  });
  next();
}
