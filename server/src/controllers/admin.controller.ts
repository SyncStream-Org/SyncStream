import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib";
import userService from "../services/userService";
import roomService from "../services/roomService";
import User from "src/models/users";
//import * as service from "../services/admin.service";

export const getRooms = async (req: Request, res: Response) => {
  const rooms = await roomService.listAllRooms();
  const roomsData: Types.RoomData[] = [];

  const user: User = (req as any).user;
  const roomsOwned = await userService.getUserRooms(user, true, true);
  const roomsPartof = await userService.getUserRooms(user, false, true);
  const roomsInvited = await userService.getUserRooms(user, false, false);
  const userRooms = roomsOwned
    .concat(roomsPartof.concat(roomsInvited))
    .map((data) => data.roomID);

  if (!rooms.length) {
    res.sendStatus(204);
    return;
  }

  for (let i = 0; i < rooms.length; i++) {
    const roomName = rooms[i].roomName;
    const roomOwner = rooms[i].roomOwner;
    const roomID = rooms[i].roomID;
    const isMember = userRooms.includes(rooms[i].roomID);
    const isInvited = roomsInvited
      .map((data) => data.roomID)
      .includes(rooms[i].roomID);
    const temp: Types.RoomData = {
      roomName,
      roomOwner,
      roomID,
      isMember,
      isInvited,
    };
    roomsData[i] = temp;
  }

  res.json(roomsData);
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await userService.listAllUsers();

  if (!users.length) {
    res.sendStatus(204);
    return;
  }

  const userData: Types.UserData[] = [];
  for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    const email = users[i].email;
    const admin = users[i].admin;
    const displayName = users[i].displayName;
    const temp: Types.UserData = { username, email, admin, displayName };
    userData[i] = temp;
  }

  res.json(userData);
};

export const createUser = async (req: Request, res: Response) => {
  const userData: Types.UserData = req.body;
  if (!Validation.isUserDataFull(userData)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  const user = await userService.getUserByUsername(userData.username);
  if (user) {
    res.status(409).json({ error: "Conflict: User already exists" });
    return;
  }
  const newUser = await userService.createUser(userData);

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
