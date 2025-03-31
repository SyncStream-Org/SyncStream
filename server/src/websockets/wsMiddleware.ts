import { Request } from 'express';
import { WebSocket } from 'ws';
import { verifyToken } from '../utils/auth';
import userService from '../services/userService';
import PresenceState from '../utils/state';
import { Validation } from 'syncstream-sharedlib';

export async function wsAuth(ws: WebSocket, req: Request, next: () => void) {
  const token = req.query.token as string;
  if (!token) {
    ws.close(1008, 'Authentication token required');
    return;
  }

  try {
    const username = await verifyToken(token);

    const user = await userService.getUserByUsername(username);
    if (!user) { 
      ws.close(1008, 'User not found');
      return;
    }

    (req as any).user = user;

    next();
  } catch(error) {
    ws.close(1008, 'Invalid token');
  }
}

export function wsPresence(ws: WebSocket, req: Request, next: () => void) {
  const username = (req as any).user.username;
  const mediaType = req.url.split('/')[3];

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
  
  PresenceState.setUserMedia(username, mediaType, req.params[`${mediaType}ID`]);

  ws.on('close', () => {
    PresenceState.clearUserMedia(username, mediaType);
  });
  next();
}