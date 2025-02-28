import { Router } from "express";
import * as controller from "../../controllers/rooms/files.controller";

const router = Router();

// TODO: any future permissions decisions to be implemented in middleware

router.put("/", controller.getAllRoomFiles);
router.put("/", controller.createFile);

router.get("/:fileName", controller.getRoomFile);
router.put("/:fileName", controller.updateRoomFile);
router.delete("/:fileName", controller.deleteRoomFile);

export default router;
