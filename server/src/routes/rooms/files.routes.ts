import { Router } from "express";
import * as controller from "../../controllers/rooms/files.controller";
import { ErrorCatcher } from "../../middleware/errorCatcher";

const router = Router({ mergeParams: true });

// TODO: any future permissions decisions to be implemented in middleware

router.get("/", ErrorCatcher(controller.getAllRoomFiles));
router.put("/", ErrorCatcher(controller.createFile));

router.get("/:fileName", ErrorCatcher(controller.getRoomFile));
router.put("/:fileName", ErrorCatcher(controller.updateRoomFile));
router.delete("/:fileName", ErrorCatcher(controller.deleteRoomFile));

export default router;
