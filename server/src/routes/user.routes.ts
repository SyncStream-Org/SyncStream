import { Router } from "express";
import * as controller from "../controllers/user.controller";

import { authMiddleware } from "../middleware/setup"

const router = Router();

router.post("/authenticate", controller.authenticate);

router.use(authMiddleware)

router.get("/user", controller.getUserDetails);
router.put("/update", controller.update);
router.get("/rooms", controller.listRooms);
router.get("/rooms/:roomID", controller.getRoomDetails);
router.delete("/rooms/:roomID", controller.removeRoomFromUser);
router.put("/rooms/:roomID/invitation", controller.acceptRoomInvite)
router.delete("/rooms/:roomID/invitation", controller.declineRoomInvite)

export default router;
