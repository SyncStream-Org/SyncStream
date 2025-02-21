import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"

import * as Auth from "../utils/auth"
import userService from "../services/userService";
import roomService from "../services/roomService";
import User from "../models/users";
//import * as service from "../services/user.service";

export const authenticate = async (req: Request, res: Response) => {
    const userData: Types.UserData = req.body;
    if (!(Validation.isUserDataAuth(userData))) { 
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    const user = await userService.getUserByUsername(userData.username);
    if (!user) { 
        res.status(404).json({ error: "Not Found: username does not exist" });
        return;
    }

    const passComparison = await Auth.comparePassword(userData.password, user.password);
    if (!passComparison) { 
        res.status(401).json({ error: "Unauthorized: invalid credentials" });
        return;
    }

    const token = Auth.generateToken(userData.username);
    const response: Types.StringMessage = { msg: token }
    res.json(response)
};

export const update = async (req: Request, res: Response) => {
    const userUpdateData: Types.UserUpdateData = req.body;
    if (!(Validation.isUserUpdateDate(userUpdateData))) { 
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    const user: User = (req as any).user;

    userService.updateUser(user, userUpdateData.password, userUpdateData.displayName, userUpdateData.email);

    res.sendStatus(200)
};

export const listRooms = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const isOwner = false;
    const isMember = true;

    const rooms = await userService.getUserRooms(user, isOwner, isMember);
    
    // TODO: add permissions after discussing in group
    const roomsData: Types.RoomData[] = []; 
    for (let i=0; i<rooms.length; i++) {
        const roomName = rooms[i].roomName;
        const roomOwner = rooms[i].roomOwner;
        const roomID = rooms[i].roomID;
        roomsData[i] = { roomName, roomOwner, roomID };
    }

    res.json(roomsData)
};

export const getRoomDetails = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { roomID_str } = req.params;
    const roomID = Number(roomID_str);

    const roomDataObj = await roomService.getRoomById(roomID);
    if (!roomDataObj) {
        res.status(404).json({ error:"Not Found: Room" });
        return;
    }
    const roomName = roomDataObj.roomName;
    const roomOwner = roomDataObj.roomOwner;
    const roomData: Types.RoomData = {roomName, roomOwner, roomID };

    const roomUserObj = await userService.getRoomUser(roomID, user.username);
    if (!roomUserObj) {
        res.status(403).json({ error:"Forbidden: User not part of Room" });
        return;
    }
    // TODO: update userPermissions when we decide on what to send
    const userPermissions: Types.RoomPermissions = { admin: false, canInviteUser: false, canRemoveUser: false };

    const userRoomData: Types.UserRoomData = { roomData, userPermissions };
    res.json(userRoomData);
};

export const removeRoomFromUser = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { roomID_str } = req.params;
    const roomID = Number(roomID_str);

    try {
        const roomUserObj = await userService.getRoomUser(roomID, user.username);
        if (!roomUserObj) {
            res.status(403).json({ error:"Forbidden: User not part of Room" });
            return;
        }
        await userService.removeRoomUser(roomUserObj);
    } catch(error) {
        res.status(404).json({ error:"Not Found: Room" })
    } 

    res.sendStatus(200);
};

export const acceptRoomInvite = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const { roomID_str } = req.params;
    const roomID = Number(roomID_str);

    try {
        const roomUserObj = await userService.getRoomUser(roomID, user.username);
        if (!roomUserObj) {
            res.status(403).json({ error:"Forbidden: User not part of Room" });
            return;
        }
        const newPermissions = undefined
        const isMember = true
        await userService.updateRoomUser(roomUserObj, newPermissions, isMember);
    } catch(error) {
        res.status(404).json({ error:"Not Found: Room" })
    } 

    res.sendStatus(200)
};

// currently seemingly have the same behavior, will discuss as a group
export const declineRoomInvite = async (req: Request, res: Response) => {
    await removeRoomFromUser(req, res);
};
