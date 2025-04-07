import { Router } from "express";
import mediaRouter from "./media.routes";

import { confirmUserInRoom } from "../middleware/setup";
import { ErrorCatcher } from "../middleware/errorCatcher";

import * as controller from "../controllers/rooms.controller";

const router = Router();

router.put("/", ErrorCatcher(controller.createRoom))

router.put("/:roomID", ErrorCatcher(controller.updateRoom))
router.delete("/:roomID", ErrorCatcher(controller.deleteRoom))
router.get("/:roomID/users", ErrorCatcher(controller.listUsers))
router.put("/:roomID/users", ErrorCatcher(controller.inviteUser))
router.delete("/:roomID/users/:username", ErrorCatcher(controller.removeUser))
router.put("/:roomID/users/:username", ErrorCatcher(controller.updateUser))

// imported routers, users required to be part of the room to access
router.use("/:roomID", ErrorCatcher(confirmUserInRoom));

router.use("/:roomID/media", mediaRouter);

export default router;
