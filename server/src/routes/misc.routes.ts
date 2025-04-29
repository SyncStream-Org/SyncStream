import { Router } from "express";
import * as controller from "../controllers/misc.controllers";
import { ErrorCatcher } from "../middleware/errorCatcher";

const router = Router();

router.post("/echo", ErrorCatcher(controller.echo));

export default router;
