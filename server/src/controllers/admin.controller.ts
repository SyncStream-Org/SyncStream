import { Request, Response } from "express";
import { Types, Validation } from "syncstream-sharedlib"
import userService from "src/services/userService";
//import * as service from "../services/admin.service";

export const getRooms = async (req: Request, res: Response) => {
    // TODO: services not yet implemented
    res.status(501).json({ error: "Not yet implemented" });
};

export const createUser = async (req: Request, res: Response) => {
    const userData: Types.UserData = req.body;
    if (!Validation.isUserDataCreate(userData)) {
        res.status(400).json({ error: "Bad Request: invalid format" });
        return;
    }

    try {
        const newUser = await userService.createUser(userData);
    } catch(error) {
        res.status(409).json({ error: "Conflict: User Exists" });
        return;
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user = await userService.getUserByUsername(username);
    if (!user) {
        res.status(404).json({ error: "Not Found: User" });
        return;
    }

    await userService.deleteUser(user);

    res.sendStatus(200);
};
