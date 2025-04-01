import { Router } from "express";
import filesRouter from "./rooms/files.routes";

import { confirmUserInRoom } from "../middleware/setup";

import * as controller from "../controllers/rooms.controller";

const router = Router();

router.put("/", controller.createRoom);

// Middleware checking for room and room user
router.use("/:roomID", confirmUserInRoom);

router.get("/:roomID", controller.joinRoom);
router.put("/:roomID", controller.updateRoom);
router.delete("/:roomID", controller.deleteRoom);
router.get("/:roomID/users", controller.listUsers);
router.put("/:roomID/users", controller.inviteUser);
router.delete("/:roomID/users/:username", controller.removeUser);
router.put("/:roomID/users/:username", controller.updateUser);

// imported routers, users required to be part of the room to access
router.use("/:roomID/files", filesRouter);

export default router;
