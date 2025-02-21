import { Router } from "express";
import * as controller from "../controllers/rooms.controller";

const router = Router();

router.put("/", controller.createRoom)

router.get("/:room_id", controller.joinRoom)
router.delete("/:room_id", controller.deleteRoom)
router.get("/:room_id/users", controller.listUsers)
router.put("/:room_id/users", controller.inviteUser)
router.delete("/:room_id/users/:username", controller.removeUser)
router.put("/:room_id/users/:username", controller.updateUser)

export default router;
