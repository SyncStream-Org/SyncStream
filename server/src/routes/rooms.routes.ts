import { Router } from "express";
import filesRouter from "./rooms/files.routes";

import * as controller from "../controllers/rooms.controller";

const router = Router();

router.put("/", controller.createRoom)

router.get("/:roomID", controller.joinRoom)
router.delete("/:roomID", controller.deleteRoom)
router.get("/:roomID/users", controller.listUsers)
router.put("/:roomID/users", controller.inviteUser)
router.delete("/:roomID/users/:username", controller.removeUser)
router.put("/:roomID/users/:username", controller.updateUser)

// imported routers
router.use("/:roomID/markdown", filesRouter);

export default router;
