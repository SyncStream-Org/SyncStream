import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"

import userService from "../services/userService";
import roomService from "../services/roomService";
import User from "../models/users";
import RoomUser from "../models/roomUsers";
import { RoomCreationAttributes, RoomUserAttributes, RoomUserPermissions } from "room-types";
import Room from "../models/rooms";
//import * as service from "../services/rooms.service";

export const createRoom = async (req: Request, res: Response) => {
    const roomNameSM: Types.StringMessage = req.body;
    if (!Validation.isStringMessage(roomNameSM)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    const roomName = roomNameSM.msg;
    // ensure room doesn't exist
    if (await roomService.getRoomByName(roomName) != null) {
        res.status(409).json({ error: "Conflict: Room Name Already Exists"});
        return;
    }

    // create room
    const roomOwner = (req as any).user.username;
    const roomData: RoomCreationAttributes = {roomName, roomOwner};
    const newRoom = await roomService.createRoom(roomData);

    const roomID = newRoom.roomID
    const roomDataResponse: Types.RoomData = {roomName, roomOwner, roomID};

    // add owner as a member of the room
    const username = roomOwner;
    const permissions: RoomUserPermissions = { canEdit: true };
    const isMember = true;
    const roomUserAttr: RoomUserAttributes = { username, roomID, permissions, isMember };
    try {
        await userService.createRoomUser(roomID, roomUserAttr);
    } catch(error) {
        res.status(500).json({ error: "Unkown Server Error has Occurred" }); // shouldn't happen, this was user/member exists in invite member, leaving in for consistency
        return;
    }

    res.json(roomDataResponse);
};

export const updateRoom = async (req: Request, res: Response) => {
    const roomUser: RoomUser = (req as any).roomUser;
    const room: Room = (req as any).room;

    if (!roomUser.permissions.canEdit) {
        res.status(403).json({ error: "Permissions: User is not allowed to edit state of room" });
        return;
    }

    const roomUpdateData: Types.RoomUpdateData = req.body;
    if (!Validation.isRoomUpdateData(roomUpdateData)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    if (roomUpdateData.newOwnerID) {
        // ensure user exists, and is part of room
        const newOwnerUser = await userService.getUserByUsername(roomUpdateData.newOwnerID);
        if (!newOwnerUser) { 
            res.status(404).json({ error: "Not Found: New owner username does not exist" });
            return;
        }
        const newOwnerRoomUser = await userService.getRoomUser(room.roomID, roomUpdateData.newOwnerID);
        if (!roomUser) {
            res.status(404).json({ error: "Bad Request: new owner user does not exist in room" });
            return;
        }

        await roomService.updateRoomOwner(room, roomUpdateData.newOwnerID);
    }
    if (roomUpdateData.newRoomName) {
        await roomService.updateRoomName(room, roomUpdateData.newRoomName);
    }

    res.sendStatus(204);
}

export const joinRoom = async (req: Request, res: Response) => {
    // TODO: requires further developing as a group on what it means to join room
    res.status(501).json({ error: "Not yet implemented" });
    return;
    const user: User = (req as any).user;
    const { roomID } = req.params;
};

export const deleteRoom = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { roomID } = req.params;

    const room = await roomService.getRoomById(roomID);
    if (!room) {
        res.status(404).json({ error:"Not Found: Room" });
        return;
    }
    
    await roomService.deleteRoom(room);

    res.sendStatus(200);
};

export const listUsers = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { roomID } = req.params;

    const room = await roomService.getRoomById(roomID);
    if (!room) {
        res.status(404).json({ error:"Not Found: Room" });
        return;
    }

    const users = await roomService.getAllRoomUsers(roomID);
    const usersData: Types.RoomsUserData[] = [];

    for (let i=0; i<users.length; i++) {
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
        const temp: Types.RoomsUserData = { username, email, displayName, isMember };
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
    let permissions: RoomUserPermissions;
    if (inviteData.permissions) {
        // TODO: likely to change as discussion on permissions evolves
        permissions = { canEdit: true }; 
    } else {
        permissions = { canEdit: false };
    }
    const isMember = false; // to be set true upon user accepting the invite
    const roomUserAttr: RoomUserAttributes = { username, roomID, permissions, isMember };
    try {
        await userService.createRoomUser(roomID, roomUserAttr);
    } catch(error) {
        res.status(409).json({ error: "Conflict: user invite|member exists" });
        return;
    }

    res.sendStatus(200);
};

export const removeUser = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { roomID, username } = req.params;

    // ensure requesting user has permissions to edit room state
    const requestingRoomUser = await userService.getRoomUser(roomID, user.username);
    if (!requestingRoomUser || !requestingRoomUser.permissions.canEdit) {
        res.status(403).json({ error: "Forbidden: Permissions Denied" });
        return;
    }

    // remove specified user
    const roomUser = await userService.getRoomUser(roomID, username);
    if (!roomUser) {
        res.status(404).json({ error: "Not Found: User not part of Room" });
        return;
    }

    await userService.removeRoomUser(roomUser);

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
    const requestingRoomUser = await userService.getRoomUser(roomID, user.username);
    if (!requestingRoomUser || !requestingRoomUser.permissions.canEdit) {
        res.status(403).json({ error: "Forbidden: Permissions Denied" });
        return;
    }

    // update specified user
    const roomUser = await userService.getRoomUser(roomID, username);
    if (!roomUser) {
        res.status(404).json({ error: "Not Found: User not part of Room" });
        return;
    }

    // TODO: to be changed as we discuss room permissions
    res.status(501).json({ error: "Not yet implemented" });
    return;

    res.sendStatus(200);
};
