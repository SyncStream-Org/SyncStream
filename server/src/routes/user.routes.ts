import { Router } from "express";
import * as controller from "../controllers/user.controller";

const router = Router();

router.post("/authenticate", controller.authenticate);
router.put("/update", controller.update);
router.get("/rooms", controller.listRooms);
router.get("/rooms/:room_id", controller.getRoomDetails);
router.delete("/rooms/:room_id", controller.removeRoomFromUser);
router.put("/user/rooms/:room_id/invitation", controller.acceptRoomInvite)
router.delete("/user/rooms/:room_id/invitation", controller.declineRoomInvite)

export default router;
