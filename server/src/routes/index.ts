import { Router } from "express";

import miscRouter from "./misc.routes"
import userRouter from "./user.routes";
import adminRouter from "./admin.routes";
import roomsRouter from "./rooms.routes";

import { authMiddleware } from "../middleware/setup"
import { ErrorCatcher } from "../middleware/errorCatcher";
import rateLimit from "express-rate-limit";

// rate limit to 1000 rq per 15min
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 1000
}); 

const router = Router();

router.use("/", miscRouter);
router.use("/user", userRouter);

router.use(ErrorCatcher(authMiddleware));
router.use(limiter, authMiddleware);

router.use("/admin", adminRouter);
router.use("/rooms", roomsRouter);

export default router;
