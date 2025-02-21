import { Router } from "express";
import * as controller from "../controllers/misc.controllers";

const router = Router();

router.post("/echo", controller.echo);

export default router;
