import { Router } from "express";
import * as controller from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth"
import { setUserMiddleware } from "../middleware/user.middleware";

const router = Router();

router.post("/authenticate", controller.authenticate);

router.use(authMiddleware)
router.use(setUserMiddleware)

router.put("/update", controller.update);
router.get("/rooms", controller.listRooms);
router.get("/rooms/:room_id", controller.getRoomDetails);
router.delete("/rooms/:room_id", controller.removeRoomFromUser);
router.put("/rooms/:room_id/invitation", controller.acceptRoomInvite)
router.delete("/rooms/:room_id/invitation", controller.declineRoomInvite)

export default router;
