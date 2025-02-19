import adminRouter from "./admin.routes";
import roomsRouter from "./rooms.routes";
import userRouter from "./user.routes";
import miscRouter from "./misc.routes"
import { Router } from "express";

const router = Router();

router.use("/admin", adminRouter);
router.use("/rooms", roomsRouter);
router.use("/user", userRouter);
router.use("/", miscRouter);

export default router;
