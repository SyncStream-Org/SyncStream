import { Router } from "express";
import * as controller from "../controllers/user.controller";

import { authMiddleware } from "../middleware/setup"
import { ErrorCatcher } from "../middleware/errorCatcher";

import rateLimit from "express-rate-limit";

// rate limit to 1000 rq per 15min
const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 1000
}); 

const router = Router();

router.post("/authenticate", ErrorCatcher(controller.authenticate));

router.use(ErrorCatcher(authMiddleware));
router.use(limiter, authMiddleware);

router.get("/", ErrorCatcher(controller.getUserDetails));
router.get("/all", ErrorCatcher(controller.getAllUsers));
router.put("/update", ErrorCatcher(controller.update));
router.get("/rooms", ErrorCatcher(controller.listRooms));
router.put("/rooms/:roomID/presence", ErrorCatcher(controller.joinRoom));
router.delete("/rooms/presence", ErrorCatcher(controller.leaveRoom));
router.get("/rooms/:roomID", ErrorCatcher(controller.getRoomDetails));
router.delete("/rooms/:roomID", ErrorCatcher(controller.removeRoomFromUser));
router.put("/rooms/:roomID/invitation", ErrorCatcher(controller.acceptRoomInvite));
router.delete("/rooms/:roomID/invitation", ErrorCatcher(controller.declineRoomInvite));
router.get("/rooms/:roomID/broadcast", ErrorCatcher(controller.enterRoomBroadcast));
router.get("/broadcast", ErrorCatcher(controller.enterUserBroadcast));
router.get("/presence", ErrorCatcher(controller.getRoomPresence));

export default router;
