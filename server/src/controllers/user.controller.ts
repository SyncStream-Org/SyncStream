import { Request, Response } from "express";
import { Types, Validation } from "shared"

import * as Auth from "../utils/auth"
import userService from "src/services/userService";
import roomService from "src/services/roomService";
import User from "src/models/users";
//import * as service from "../services/user.service";

// TODO: update error response codes, and messages
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
    let roomsData: Types.RoomData[] = []; 
    for (let i=0; i<rooms.length; i++) {
        let roomName = rooms[i].roomName;
        let roomOwner = rooms[i].roomOwner;
        let roomID = rooms[i].roomID;
        roomsData[i] = { roomName, roomOwner, roomID };
    }

    res.json(roomsData)
};

export const getRoomDetails = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    let { room_id_str } = req.params;
    let room_id = Number(room_id_str);

    const roomDataObj = await roomService.getRoomById(room_id);
    if (!roomDataObj) {
        res.status(404).json({ error:"Room not found" });
        return;
    }
    const roomName = roomDataObj.roomName;
    const roomOwner = roomDataObj.roomOwner;
    const roomID = roomDataObj.roomID;
    const roomData: Types.RoomData = {roomName, roomOwner, roomID };

    const roomUserObj = await userService.getRoomUser(room_id, user.username);
    if (!roomUserObj) {
        res.status(403).json({ error:"User not part of Room" });
        return;
    }
    // TODO: update userPermissions when we decide on what to send
    const userPermissions: Types.RoomPermissions = { msg:"TODO: must discuss this further as a group" };

    const userRoomData: Types.UserRoomData = { roomData, userPermissions };
    res.json(userRoomData);
};

export const removeRoomFromUser = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    let { room_id_str } = req.params;
    let room_id = Number(room_id_str);

    try {
        const roomUserObj = await userService.getRoomUser(room_id, user.username);
        if (!roomUserObj) {
            res.status(403).json({ error:"User not part of Room" });
            return;
        }
        await userService.removeRoomUser(roomUserObj);
    } catch(error) {
        res.status(404).json({ error:"Room not found" })
    } 

    res.sendStatus(200);
};

export const acceptRoomInvite = async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    let { room_id_str } = req.params;
    let room_id = Number(room_id_str);

    try {
        const roomUserObj = await userService.getRoomUser(room_id, user.username);
        if (!roomUserObj) {
            res.status(403).json({ error:"User not part of Room" });
            return;
        }
        const newPermissions = undefined
        const isMember = true
        await userService.updateRoomUser(roomUserObj, newPermissions, isMember);
    } catch(error) {
        res.status(404).json({ error:"Room not found" })
    } 

    res.sendStatus(200)
};

// currently seemingly have the same behavior, will discuss as a group
export const declineRoomInvite = async (req: Request, res: Response) => {
    await removeRoomFromUser(req, res);
};
