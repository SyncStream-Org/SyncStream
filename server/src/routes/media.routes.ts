import { Router } from "express";
import * as controller from "../controllers/media.controller";

const router = Router({ mergeParams: true });

// TODO: any future permissions decisions to be implemented in middleware

router.get("/", controller.getAllRoomMedia);
router.put("/", controller.createMedia);

router.get("/:mediaID", controller.getRoomMedia);
router.put("/:mediaID", controller.updateRoomMedia);
router.delete("/:mediaID", controller.deleteRoomMedia);

export default router;
