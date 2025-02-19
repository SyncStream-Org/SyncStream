import { Request, Response } from "express";
import { Types, Validation } from "shared"
//import * as service from "../services/admin.service";

export const getRooms = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const createUser = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const deleteUser = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};
