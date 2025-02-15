import { Request, Response } from "express";
//import * as service from "../services/user.service";

export const authenticate = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const update = async (req: Request, res: Response) => {
    // TODO as database helper gets implemented
    res.status(501).json({ error: "Not yet implemented" });
};
