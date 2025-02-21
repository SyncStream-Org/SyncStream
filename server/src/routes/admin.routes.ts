import { Router } from "express";
import * as controller from "../controllers/admin.controller";

import { adminMiddleware } from "src/middleware/admin";

const router = Router();

router.use(adminMiddleware)

router.post("/user/create", controller.createUser);
router.delete("/user/delete", controller.deleteUser);
router.get("/rooms/getRooms", controller.getRooms)

export default router;
