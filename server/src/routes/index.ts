import adminRouter from "./admin.routes";
import roomsRouter from "./rooms.routes";
import userRouter from "./user.routes";
import miscRouter from "./misc.routes"
import { Router } from "express";

import { authMiddleware } from "../middleware/auth"

const router = Router();

router.use("/user", userRouter);

router.use(authMiddleware)

router.use("/admin", adminRouter);
router.use("/rooms", roomsRouter);
router.use("/", miscRouter);

export default router;
