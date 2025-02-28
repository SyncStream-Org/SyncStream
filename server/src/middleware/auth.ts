import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

import userService from "../services/userService";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers)
  const token = req.headers['session-token'] as string;
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No Token Present" });
    return;
  }

  try {
    const username = await verifyToken(token);

    const user = await userService.getUserByUsername(username);
    if (!user) { 
        res.status(404).json({ error: "Not Found: authentication username does not exist" });
        return;
    }

    (req as any).user = user;

    next();
  } catch(error) {
    res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};
