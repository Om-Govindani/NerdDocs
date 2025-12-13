import express from "express";
import auth from "../middleware/auth.js";
import * as topicCtrl from "../controllers/topicController.js";
const router = express.Router();
router.get("/:topicId/content", auth, topicCtrl.getTopicContent);
export default router;
