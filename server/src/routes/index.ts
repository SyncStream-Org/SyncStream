import { Router } from "express";

import miscRouter from "./misc.routes"
import userRouter from "./user.routes";
import adminRouter from "./admin.routes";
import roomsRouter from "./rooms.routes";
import filesRouter from "./files.routes";

import { authMiddleware } from "../middleware/setup"

const router = Router();

router.use("/", miscRouter);
router.use("/user", userRouter);

router.use(authMiddleware)

router.use("/admin", adminRouter);
router.use("/rooms", roomsRouter);
router.use("/rooms/{room_id}/markdown", filesRouter);

export default router;
