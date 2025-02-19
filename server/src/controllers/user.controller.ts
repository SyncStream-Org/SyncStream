import { Request, Response } from "express";
import { Types, Validation } from "shared"
//import * as service from "../services/user.service";

export const authenticate = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
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
