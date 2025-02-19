import { Request, Response } from "express";
import { Types, Validation } from "shared"
//import * as service from "../services/user.service";

export const echo = async (req: Request, res: Response) => {
    if(!req.body) {
        res.status(400).json({ error: "No JSON body provided" });
        return;
      }
      res.json(req.body);
};