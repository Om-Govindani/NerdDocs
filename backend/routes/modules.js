import express from "express";
import auth from "../middleware/auth.js";
import * as moduleCtrl from "../controllers/moduleController.js";
const router = express.Router();
router.get("/:moduleId/topics", auth, moduleCtrl.getModuleTopics);
export default router;
