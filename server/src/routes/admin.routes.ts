import { Router } from "express";
import * as controller from "../controllers/admin.controller";

import { adminMiddleware } from "../middleware/admin";
import { ErrorCatcher } from "../middleware/errorCatcher";

const router = Router();

router.use(ErrorCatcher(adminMiddleware));

router.put("/user/", ErrorCatcher(controller.createUser));
router.get("/users/", ErrorCatcher(controller.listUsers));
router.delete("/user/:username", ErrorCatcher(controller.deleteUser));
router.get("/rooms/", ErrorCatcher(controller.getRooms))

export default router;
