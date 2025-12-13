import express from "express";
import auth from "../middleware/auth.js";
import * as userCtrl from "../controllers/userController.js";
const router = express.Router();
router.get("/my-courses", auth, userCtrl.getMyCourses);
router.get("/course/:courseId/status", auth, userCtrl.getCourseStatus);
export default router;
