import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

import userService from "../services/userService";
import User from "../models/users";
import roomService from "../services/roomService";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['session-token'] as string;
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No Token Present" });
    return;
  }

  try {
    const username = await verifyToken(token);

    const user = await userService.getUserByUsername(username);
    if (!user) { 
        res.status(404).json({ error: "Not Found: authentication username does not exist" });
        return;
    }

    (req as any).user = user;

    next();
  } catch(error) {
    res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

export const confirmUserInRoom = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = (req as any).user;
  
  const { roomID } = req.params;
  if (!roomID) {
    res.status(400).json({ error: "Bad Request: roomID is required" });
    return;
  }

  const room = await roomService.getRoomById(roomID);
  if (!room) {
    res.status(404).json({ error: "Bad Request: room does not exist" });
    return;
  }
  if (room.roomOwner === user.username) {
    next();
    return;
  }
  
  const roomUser = await userService.getRoomUser(roomID, user.username);
  if (!roomUser) {
    res.status(404).json({ error: "Bad Request: user does not exist in room" });
    return;
  }

  next();
}
