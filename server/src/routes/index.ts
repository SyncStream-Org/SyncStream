import adminRouter from "./admin.routes";
import roomsRouter from "./rooms.routes";
import userRouter from "./user.routes";
import { Router } from "express";

const router = Router();

router.use("/admin", adminRouter);
router.use("/rooms", roomsRouter);
router.use("/user", userRouter);

export default router;
