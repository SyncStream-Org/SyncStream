import { Router } from "express";
import * as controller from "../controllers/misc.controllers";
import { ErrorCatcher } from "../middleware/errorCatcher";

const router = Router();

router.post("/echo", ErrorCatcher(controller.echo));
router.get("/api", ErrorCatcher(controller.getAPI));

export default router;
