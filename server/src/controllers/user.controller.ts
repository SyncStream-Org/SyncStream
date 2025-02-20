import { Request, Response } from "express";
import { Types, Validation } from "shared"
import * as Auth from "../utils/auth"
//import * as service from "../services/user.service";

import userService from "src/services/userService";

// TODO: update error response codes, and messages
export const authenticate = async (req: Request, res: Response) => {
    let userData: Types.UserData = req.body;
    if (!(Validation.isUserDataAuth(userData))) { return res.status(401).json({ error: "invalid credentials" }) }

    let user = await userService.getUserByUsername(userData.username);
    if (!user) { return res.status(401).json({ error: "invalid credentials" }) }

    let passComparison = await Auth.comparePassword(userData.password, user.password);
    if (!passComparison) { return res.status(401).json({ error: "invalid credentials" }) }

    const token = Auth.generateToken(userData.username);
    let response: Types.StringMessage = { msg: token }
    res.json(response)
};

export const update = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
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
