import { Request } from 'express';
import { WebSocket } from 'ws';
import { verifyToken } from '../utils/auth';
import userService from '../services/userService';
import PresenceState from '../utils/state';

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
  // split the route to get the media type
  console.log(req.url);
  next();
}