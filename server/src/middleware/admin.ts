import { Request, Response, NextFunction } from "express";
import { verifyToken } from "src/utils/auth";

import userService from "src/services/userService";
import User from "src/models/users";

// ensure requesting user is an admin
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = (req as any).user;
  if(!user.admin) {
    res.status(403).json({ error: "Forbidden: Permissions Denied" });
    return;
  }

  next();
};
