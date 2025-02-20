import { Request, Response, NextFunction } from "express";
import { verifyToken } from "src/utils/auth";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No Token Present" });
    return;
  }

  try {
    const username = await verifyToken(token);
    (req as any).user = { username }
    next();
  } catch(error) {
    res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};
