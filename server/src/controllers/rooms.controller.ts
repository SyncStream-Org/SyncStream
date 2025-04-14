import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib";
import userService from "../services/userService";
import roomService from "../services/roomService";
import User from "../models/users";
import RoomUser from "../models/roomUsers";
import {
  RoomCreationAttributes,
  RoomUserAttributes,
  RoomUserPermissions,
} from "room-types";
import Room from "../models/rooms";
import Broadcaster from "../utils/broadcaster";

export const createRoom = async (req: Request, res: Response) => {
  const roomNameSM: Types.StringMessage = req.body;
  if (!Validation.isStringMessage(roomNameSM)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  const roomName = roomNameSM.msg;
  // ensure room doesn't exist
  if ((await roomService.getRoomByName(roomName)) != null) {
    res.status(409).json({ error: "Conflict: Room Name Already Exists" });
    return;
  }

  // create room
  const roomOwner = (req as any).user.username;
  const roomData: RoomCreationAttributes = { roomName, roomOwner };
  const newRoom = await roomService.createRoom(roomData);

  const roomID = newRoom.roomID;
  const roomDataResponse: Types.RoomData = { roomName, roomOwner, roomID };

  // add owner as a member of the room
  const username = roomOwner;
  const permissions: RoomUserPermissions = { canEdit: true };
  const isMember = true;
  const roomUserAttr: RoomUserAttributes = {
    username,
    roomID,
    permissions,
    isMember,
  };
  try {
    await userService.createRoomUser(roomID, roomUserAttr);
  } catch (error) {
    res.status(500).json({ error: "Unkown Server Error has Occurred" }); // shouldn't happen, this was user/member exists in invite member, leaving in for consistency
    return;
  }

  // broadcast the update to the room owner
  Broadcaster.pushUpdateToUsers(
    [username],
    {
      type: "create",
      data: {isMember: true, ...roomDataResponse},
    },
  );

  res.json(roomDataResponse);
};

export const updateRoom = async (req: Request, res: Response) => {
  const roomUser: RoomUser = (req as any).roomUser;
  let room: Room = (req as any).room;

  if (!roomUser.permissions.canEdit) {
    res
      .status(403)
      .json({
        error: "Permissions: User is not allowed to edit state of room",
      });
    return;
  }

  const roomUpdateData: Types.RoomUpdateData = req.body;
  if (!Validation.isRoomUpdateData(roomUpdateData)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  if (roomUpdateData.newOwnerID) {
    // ensure user exists, and is part of room
    const newOwnerUser = await userService.getUserByUsername(
      roomUpdateData.newOwnerID,
    );
    if (!newOwnerUser) {
      res
        .status(404)
        .json({ error: "Not Found: New owner username does not exist" });
      return;
    }
    const newOwnerRoomUser = await userService.getRoomUser(
      room.roomID,
      roomUpdateData.newOwnerID,
    );
    if (!roomUser) {
      res
        .status(404)
        .json({ error: "Bad Request: new owner user does not exist in room" });
      return;
    }

    room = await roomService.updateRoomOwner(room, roomUpdateData.newOwnerID);
  }
  if (roomUpdateData.newRoomName) {
    room = await roomService.updateRoomName(room, roomUpdateData.newRoomName);
  }

  const roomDataResponse: Types.RoomData = {
    roomName: room.roomName,
    roomOwner: room.roomOwner,
    roomID: room.roomID,
  };

  // get all of the users
  const users = await roomService.getAllRoomUsers(room.roomID);
  const members = users.filter((user) => user.isMember).map((user) => user.username);
  const invited = users.filter((user) => !user.isMember).map((user) => user.username);

  // broadcast the update to all users
  Broadcaster.pushUpdateToUsers(
    members,
    {
      type: "update",
      data: { isMember: true, ...roomDataResponse },
    },
  );
  Broadcaster.pushUpdateToUsers(
    invited,
    {
      type: "update",
      data: { isMember: false, ...roomDataResponse },
    },
  );

  res.sendStatus(204);
}

export const deleteRoom = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;

  const room = await roomService.getRoomById(roomID);
  if (!room) {
    res.status(404).json({ error: "Not Found: Room" });
    return;
  }
  
  // get all of the users
  const users = await roomService.getAllRoomUsers(room.roomID);
  const members = users.filter((user) => user.isMember).map((user) => user.username);
  const invited = users.filter((user) => !user.isMember).map((user) => user.username);

  await roomService.deleteRoom(room);
  const roomDataResponse: Types.RoomData = {
    roomName: room.roomName,
    roomOwner: room.roomOwner,
    roomID: room.roomID,
  };
  // broadcast the update to all users
  Broadcaster.pushUpdateToUsers(
    members,
    {
      type: "delete",
      data: { isMember: true, ...roomDataResponse },
    },
  );
  Broadcaster.pushUpdateToUsers(
    invited,
    {
      type: "delete",
      data: { isMember: false, ...roomDataResponse },
    },
  );
  res.sendStatus(200);
};

export const listUsers = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;

  const room = await roomService.getRoomById(roomID);
  if (!room) {
    res.status(404).json({ error: "Not Found: Room" });
    return;
  }

  const users = await roomService.getAllRoomUsers(roomID);
  const usersData: Types.RoomsUserData[] = [];

  for (let i = 0; i < users.length; i++) {
    const username = users[i].username;
    const isMember = users[i].isMember;
    const user = await userService.getUserByUsername(username);
    if (!user) {
      // shouldn't happen
      res.sendStatus(500);
      return;
    }
    const email = user.email;
    const displayName = user.displayName;
    const temp: Types.RoomsUserData = {
      username,
      email,
      displayName,
      isMember,
    };
    usersData[i] = temp;
  }

  res.json(usersData);
};

export const inviteUser = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID } = req.params;
  const inviteData: Types.InviteData = req.body;
  if (!Validation.isInviteDataMinimum(inviteData)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  const username = inviteData.username;
  // ensure user exists
  const invitedUser = await userService.getUserByUsername(username);
  if (!invitedUser) {
    res.status(404).json({ error: "Bad Request: Invited User does not exist" });
    return;
  }

  // invite user
  let permissions: RoomUserPermissions;
  if (inviteData.permissions) {
    // TODO: likely to change as discussion on permissions evolves
    permissions = { canEdit: true };
  } else {
    permissions = { canEdit: false };
  }
  const isMember = false; // to be set true upon user accepting the invite
  const roomUserAttr: RoomUserAttributes = {
    username,
    roomID,
    permissions,
    isMember,
  };
  try {
    await userService.createRoomUser(roomID, roomUserAttr);
  } catch (error) {
    res.status(409).json({ error: "Conflict: user invite|member exists" });
    return;
  }

  // get the room and send to the user
  const room = (await roomService.getRoomById(roomID))!;
  const roomDataResponse: Types.RoomData = {
    roomName: room.roomName,
    roomOwner: room.roomOwner,
    roomID: room.roomID,
  };

  // broadcast the update to the invited user
  Broadcaster.pushUpdateToUsers(
    [username],
    {
      type: "create",
      data: { isMember: false, ...roomDataResponse },
    },
  );

  res.sendStatus(200);
};

export const removeUser = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID, username } = req.params;

  // ensure requesting user has permissions to edit room state
  const requestingRoomUser = await userService.getRoomUser(
    roomID,
    user.username,
  );
  if (!requestingRoomUser || !requestingRoomUser.permissions.canEdit) {
    res.status(403).json({ error: "Forbidden: Permissions Denied" });
    return;
  }

  // ensure user exists
  const removedUser = await userService.getUserByUsername(username);
  if (!removedUser) {
    res.status(404).json({ error: "Bad Request: User does not exist" });
    return;
  }

  // remove specified user
  const roomUser = await userService.getRoomUser(roomID, username);
  if (!roomUser) {
    res.status(404).json({ error: "Not Found: User not part of Room" });
    return;
  }
  const member = roomUser.isMember;

  await userService.removeRoomUser(roomUser);
  const room = (await roomService.getRoomById(roomID))!;
  const roomDataResponse: Types.RoomData = {
    roomName: room.roomName,
    roomOwner: room.roomOwner,
    roomID: room.roomID,
  };

  // broadcast the update to the user
  Broadcaster.pushUpdateToUsers(
    [username],
    {
      type: "delete",
      data: { isMember: member, ...roomDataResponse },
    },
  );

  res.sendStatus(200);
};

export const updateUser = async (req: Request, res: Response) => {
  const user: User = (req as any).user;
  const { roomID, username } = req.params;
  const roomPermissions: Types.RoomPermissions = req.body;
  if (!Validation.isRoomPermissions(roomPermissions)) {
    res.status(400).json({ error: "Bad Request: invalid format" });
    return;
  }

  // ensure requesting user has permissions to edit room state
  const requestingRoomUser = await userService.getRoomUser(
    roomID,
    user.username,
  );
  if (!requestingRoomUser || !requestingRoomUser.permissions.canEdit) {
    res.status(403).json({ error: "Forbidden: Permissions Denied" });
    return;
  }

  // ensure user exists
  const updatingUser = await userService.getUserByUsername(username);
  if (!updatingUser) {
    res.status(404).json({ error: "Bad Request: User does not exist" });
    return;
  }

  // update specified user
  const roomUser = await userService.getRoomUser(roomID, username);
  if (!roomUser) {
    res.status(404).json({ error: "Not Found: User not part of Room" });
    return;
  }

  // TODO: propogate room permissions
  res.sendStatus(501);
  return;
  //await userService.updateRoomUser(roomUser, roomPermissions);

  res.sendStatus(200);
};
