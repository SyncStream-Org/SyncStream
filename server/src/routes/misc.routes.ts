import { Router } from "express";
import * as controller from "../controllers/misc.controllers";

const router = Router();

router.get("/echo", controller.echo);

export default router;
