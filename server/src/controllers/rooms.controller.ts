import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"
//import * as service from "../services/rooms.service";

export const createRoom = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const joinRoom = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const deleteRoom = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const listUsers = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const inviteUser = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const removeUser = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const updateUser = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};
