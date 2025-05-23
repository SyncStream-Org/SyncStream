import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib";

import * as Auth from "../utils/auth";
import userService from "../services/userService";
import roomService from "../services/roomService";
import User from "../models/users";
import Room from "../models/rooms";
import PresenceState from "../utils/state";
import Broadcaster from "../utils/broadcaster";

export const authenticate = async (req: Request, res: Response) => {
  const userData: Types.UserData = req.body;
  if (!Validation.isUserDataAuth(userData)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  const user = await userService.getUserByUsername(userData.username);
  if (!user) {
    res.status(404).json({ error: "Not Found: username does not exist" });
    return;
  }

  const passComparison = await Auth.comparePassword(
    userData.password,
    user.password,
  );
  if (!passComparison) {
    res.status(401).json({ error: "Unauthorized: invalid credentials" });
    return;
  }

  PresenceState.removeUserEntry(userData.username);
  const token = Auth.generateToken(userData.username);
  const response: Types.StringMessage = { msg: `${token}+${user.isPasswordAuto}` };
  res.json(response);
};

export const getUserDetails = async (req: Request, res: Response) => {
  const user: User = (req as any).user;

  const username = user.username;
  const email = user.email;
  const admin = user.admin;
  const displayName = user.displayName;
  const userData: Types.UserData = { username, email, admin, displayName };

  res.json(userData);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.listAllUsers(true);

  if (!users.length) {
    res.sendStatus(204);
    return;
  }

  const userData: Types.UserData[] = [];
  for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    const email = users[i].email;
    const displayName = users[i].displayName;
    const temp: Types.UserData = { username, email, displayName };
    userData[i] = temp;
  }

  res.json(userData);
};

export const update = async (req: Request, res: Response) => {
  const userUpdateData: Types.UserUpdateData = req.body;
  if (!Validation.isUserUpdateDate(userUpdateData)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  const user: User = (req as any).user;

  await userService.updateUser(user, userUpdateData);

  res.sendStatus(200);
};

export const listRooms = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const isMember = true;

  const roomsOwned = await userService.getUserRooms(user, true, isMember); // FIX: Returns rooms that user is only a member of as well as an owner
  const roomsPartof = await userService.getUserRooms(user, false, isMember);
  const roomsInvited = await userService.getUserRooms(user, false, false);
  const rooms = roomsOwned.concat(roomsPartof).concat(roomsInvited);

  // TODO: add permissions after discussing in group
  const roomsData: Types.RoomData[] = [];
  for (let i = 0; i < rooms.length; i++) {
    const roomName = rooms[i].roomName;
    const roomOwner = rooms[i].roomOwner;
    const roomID = rooms[i].roomID;
    const isMember = i < roomsOwned.length + roomsPartof.length;
    roomsData[i] = { roomName, roomOwner, roomID, isMember };
  }

  res.json(roomsData);
};

export const getRoomDetails = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;

  const roomDataObj = await roomService.getRoomById(roomID);
  if (!roomDataObj) {
    res.status(404).json({ error: "Not Found: Room" });
    return;
  }
  const roomName = roomDataObj.roomName;
  const roomOwner = roomDataObj.roomOwner;
  const roomData: Types.RoomData = { roomName, roomOwner, roomID };

  const roomUserObj = await userService.getRoomUser(roomID, user.username);
  if (!roomUserObj) {
    res.status(403).json({ error: "Forbidden: User not part of Room" });
    return;
  }
  // TODO: update userPermissions when we decide on what to send
  const userPermissions: Types.RoomPermissions = {
    admin: false,
    canInviteUser: false,
    canRemoveUser: false,
  };

  const userRoomData: Types.UserRoomData = { roomData, userPermissions };
  res.json(userRoomData);
};

export const removeRoomFromUser = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;

  const roomCheck = roomService.getRoomById(roomID);
  if (!roomCheck) {
    res.status(404).json({ error: "Not Found: Room" });
    return;
  }

  const roomUserObj = await userService.getRoomUser(roomID, user.username);
  if (!roomUserObj) {
    res.status(403).json({ error: "Forbidden: User not part of Room" });
    return;
  }
  await userService.removeRoomUser(roomUserObj);
  // broadcast to room
  Broadcaster.pushUpdateToRoom(roomID, {
    endpoint: "user",
    type: "delete",
    data: { username: user.username, isMember: false },
  });
  res.sendStatus(200);
};

export const acceptRoomInvite = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;

  const roomCheck = roomService.getRoomById(roomID);
  if (!roomCheck) {
    res.status(404).json({ error: "Not Found: Room" });
    return;
  }

  const roomUserObj = await userService.getRoomUser(roomID, user.username);
  if (!roomUserObj) {
    res.status(403).json({ error: "Forbidden: User not part of Room" });
    return;
  }
  const newPermissions = undefined;
  const isMember = true;
  await userService.updateRoomUser(roomUserObj, newPermissions, isMember);

  // tell the room
  Broadcaster.pushUpdateToRoom(roomID, {
    endpoint: "user",
    type: "update",
    data: { username: user.username, isMember },
  });
  res.sendStatus(200);
};

// currently seemingly have the same behavior, will discuss as a group
export const declineRoomInvite = async (req: Request, res: Response) => {
  await removeRoomFromUser(req, res);
};

export const joinRoom = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;

  // check if room exists, and if the user is part of it
  try {
    const roomUser = await userService.getRoomUser(roomID, user.username);
    if ((!roomUser || !roomUser.isMember) && !user.admin) {
      res.status(403).json({ error: "Forbidden: User not part of Room" });
      return;
    }
  } catch {
    res.status(404).json({ error: "Not Found: Room doesn't exist" });
    return;
  }

  // check if user is already in a room
  if (PresenceState.getUserEntry(user.username) !== undefined) {
    res.status(409).json({ error: "Conflict: User already in a room" });
    return;
  }

  PresenceState.addUserEntry(user.username, roomID);
  // broadcast to users in the room
  let usersInRoom = (await roomService.getAllRoomUsers(roomID)).map((user) => user.username);
  const admins = (await userService.listAllUsers(false)).map((user) => user.username);
  usersInRoom = usersInRoom.filter((username) => !admins.includes(username));

  Broadcaster.pushUpdateToUsers(
    [...usersInRoom, ...admins],
    {
      endpoint: "presence",
      type: "create",
      data: {
        username: user.username,
        roomID,
      }
    },
  );
  res.sendStatus(200);
};

export const leaveRoom = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  if (PresenceState.getUserEntry(user.username) === undefined) {
    res.status(404).json({ error: "Not Found: User not in any room" });
    return;
  }
  const { roomID } = PresenceState.getUserEntry(user.username)!;
  PresenceState.removeUserEntry(user.username);
  // broadcast to users in the room
  let usersInRoom = (await roomService.getAllRoomUsers(roomID)).map((user) => user.username);
  const admins = (await userService.listAllUsers(false)).map((user) => user.username);
  usersInRoom = usersInRoom.filter((username) => !admins.includes(username));

  Broadcaster.pushUpdateToUsers(
    [...usersInRoom, ...admins],
    {
      endpoint: "presence",
      type: "delete",
      data: {
        username: user.username,
        roomID,
      }
    },
  )
  res.sendStatus(200);
};

// user entering Server-Side Event Broadcasting for their room
// separate from joinRoom to for keep-alive headers
export const enterRoomBroadcast = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const user: User = (req as any).user;
  const { roomID } = req.params;

  // Ensure user presence in room
  const presence = PresenceState.getUserEntry(user.username);
  if (presence == undefined) {
    res
      .status(404)
      .write(JSON.stringify({ error: "Not Found: User not in any room" }));
    res.end();
    return;
  }
  if (presence.roomID !== roomID) {
    res
      .status(400)
      .write(
        JSON.stringify({
          error: "Bad Request: RoomID does not match current active room",
        }),
      );
    res.end();
    return;
  }

  // set connection and send message
  Broadcaster.addRoomResponse(roomID, res);

  req.on("close", () => {
    //remove from room->user map
    Broadcaster.removeRoomResponse(roomID, res);
    res.end();
  });
};

export const enterUserBroadcast = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const user: User = (req as any).user;

  // set connection and send message
  Broadcaster.addUserResponse(user.username, res);

  req.on("close", () => {
    //remove from room->user map
    Broadcaster.removeUserResponse(user.username);
    res.end();
  });
};

export const getRoomPresence = async (req: Request, res: Response) => {
  const user: User = (req as any).user;

  let rooms: Room[] = [];
  if (user.admin) {
    rooms = await roomService.listAllRooms();
  } else {
    rooms = await userService.getUserRooms(user, false, true);
    rooms = (await userService.getUserRooms(user, true, true)).concat(rooms);
  }
  const roomIDs = rooms.map((room) => room.roomID);
  const roomPresence = PresenceState.getUsersInRooms(roomIDs);

  res.json(roomPresence);
};
  