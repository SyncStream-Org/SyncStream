import { Router } from "express";
import * as controller from "../controllers/rooms.controller";

const router = Router();

// endpoints w/o room_id
router.get("/getRooms", controller.getRooms); 
router.delete("/deleteRoom", controller.deleteRoom); 
router.post("/createRoom", controller.createRoom);

// endpoints w/room_id
router.post("/:room_id/inviteUser", controller.inviteUser); 
router.delete("/:room_id/removeUser", controller.removeUser); 
router.put("/:room_id/updateUser", controller.updateUser);
router.get("/:room_id/listUsers", controller.listUsers);
router.put("/:room_id/acceptInvite", controller.acceptInvite);
router.get("/:room_id/joinRoom", controller.joinRoom);

export default router;
