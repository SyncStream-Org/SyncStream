import { Router } from "express";
import * as controller from "../controllers/admin.controller";

import { adminMiddleware } from "../middleware/admin";

const router = Router();

router.use(adminMiddleware)

router.put("/user/", controller.createUser);
router.delete("/user/:user", controller.deleteUser);
router.get("/rooms/", controller.getRooms)

export default router;
