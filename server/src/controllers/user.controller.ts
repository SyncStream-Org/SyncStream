import { Request, Response } from "express";
import { Types, Validation } from "shared"

import * as Auth from "../utils/auth"
import userService from "src/services/userService";
import User from "src/models/users";
//import * as service from "../services/user.service";

// TODO: update error response codes, and messages
export const authenticate = async (req: Request, res: Response) => {
    const userData: Types.UserData = req.body;
    if (!(Validation.isUserDataAuth(userData))) { 
        res.status(401).json({ error: "invalid credentials" });
        return;
    }

    const user = await userService.getUserByUsername(userData.username);
    if (!user) { 
        res.status(401).json({ error: "invalid credentials" });
        return;
    }

    const passComparison = await Auth.comparePassword(userData.password, user.password);
    if (!passComparison) { 
        res.status(401).json({ error: "invalid credentials" });
        return;
    }

    const token = Auth.generateToken(userData.username);
    const response: Types.StringMessage = { msg: token }
    res.json(response)
};

// TODO: update error response codes, and messages
export const update = async (req: Request, res: Response) => {
    const userUpdateData: Types.UserUpdateData = req.body;
    if (!(Validation.isUserUpdateDate(userUpdateData))) { 
        res.status(401).json({ error: "invalid format" });
        return;
    }

    const user: User =(req as any).user

    userService.updateUser(user, userUpdateData.password, userUpdateData.displayName, userUpdateData.email);

    res.status(200)
};

export const listRooms = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const getRoomDetails = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const removeRoomFromUser = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const acceptRoomInvite = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const declineRoomInvite = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};
