import { Router } from "express";
import * as controller from "../controllers/admin.controller";

const router = Router();

router.put("/user/create", controller.createUser);
router.delete("/user/delete", controller.deleteUser);
router.get("/rooms/getRooms", controller.getRooms)

export default router;
