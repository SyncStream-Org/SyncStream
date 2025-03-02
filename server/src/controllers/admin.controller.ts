import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib";
import userService from "../services/userService";
import roomService from "../services/roomService";
//import * as service from "../services/admin.service";

export const getRooms = async (req: Request, res: Response) => {
  const rooms = await roomService.listAllRooms();
  const roomsData: Types.RoomData[] = [];

  if (!rooms.length) {
    res.sendStatus(204);
    return;
  }

  for (let i = 0; i < rooms.length; i++) {
    const roomName = rooms[i].roomName;
    const roomOwner = rooms[i].roomOwner;
    const roomID = rooms[i].roomID;
    const temp: Types.RoomData = { roomName, roomOwner, roomID };
    roomsData[i] = temp;
  }

  res.json(roomsData);
};

export const createUser = async (req: Request, res: Response) => {
  const userData: Types.UserData = req.body;
  if (!Validation.isUserDataFull(userData)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  try {
    const newUser = await userService.createUser(userData);
  } catch (error) {
    res.status(409).json({ error: "Conflict: User Exists" });
    return;
  }

  res.sendStatus(200);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await userService.getUserByUsername(username);
  if (!user) {
    res.status(404).json({ error: "Not Found: User" });
    return;
  }

  await userService.deleteUser(user);

  res.sendStatus(200);
};
