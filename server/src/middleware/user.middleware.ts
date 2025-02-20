import { Request, Response, NextFunction } from "express";
import userService from "src/services/userService";

// applicable to all /user endpoints (except authenicate), so defining as middleware
export const setUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let username: string = (req as any).user; 

    const user = await userService.getUserByUsername(username);
    if (!user) { 
        res.status(401).json({ error: "invalid credentials" });
        return;
    }

    (req as any).user = user;

    next();
};
