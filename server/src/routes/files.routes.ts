import { Router } from "express";
import * as controller from "../controllers/files.controller";

const router = Router();

// TODO: any future permissions decisions to be implemented in middleware

router.put("/", controller.getAllRoomFiles);
router.put("/", controller.createFile);

router.get("/:document_id", controller.getRoomFile);
router.put("/:document_id", controller.updateRoomFile);
router.delete("/:document_id", controller.deleteRoomFile);

export default router;
