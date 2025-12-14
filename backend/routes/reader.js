import express from "express";
import * as readerCtrl from "../controllers/readerController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:courseId/outline", auth, readerCtrl.getReaderOutline);
router.get("/topic/:topicId", auth, readerCtrl.getTopicContent);
router.get("/:courseId", auth, readerCtrl.getCourseReader);

export default router;
