import { Router } from "express";
import * as controller from "../controllers/user.controller";

const router = Router();

router.get("/authenticate", controller.authenticate);
router.put("/update", controller.update);

export default router;
