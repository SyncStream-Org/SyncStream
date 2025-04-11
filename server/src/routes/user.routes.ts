import { Router } from "express";
import * as controller from "../controllers/user.controller";

import { authMiddleware } from "../middleware/setup"
import { ErrorCatcher } from "../middleware/errorCatcher";


const router = Router();

router.post("/authenticate", ErrorCatcher(controller.authenticate));

router.use(authMiddleware);

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

export default router;
