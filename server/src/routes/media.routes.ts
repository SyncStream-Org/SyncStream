import { Router } from "express";
import * as controller from "../controllers/media.controller";
import { ErrorCatcher } from "../middleware/errorCatcher";

const router = Router({ mergeParams: true });

// TODO: any future permissions decisions to be implemented in middleware

router.get("/", ErrorCatcher(controller.getAllRoomMedia));
router.put("/", ErrorCatcher(controller.createMedia));

router.get("/:mediaID", ErrorCatcher(controller.getRoomMedia));
router.put("/:mediaID", ErrorCatcher(controller.updateRoomMedia));
router.delete("/:mediaID", ErrorCatcher(controller.deleteRoomMedia));

export default router;
