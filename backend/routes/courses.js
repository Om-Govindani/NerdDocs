import express from "express";
import * as courseCtrl from "../controllers/courseController.js";
import auth from "../middleware/auth.js";
import authOptional from "../middleware/authOptional.js";
const router = express.Router();
router.get("/categories", courseCtrl.getCategories);
router.get("/", authOptional, courseCtrl.getCourses); // authOptional: try to set req.user if cookie exists
router.get("/:courseId/meta", authOptional, courseCtrl.getCourseMeta);
router.get("/:courseId/modules", courseCtrl.getCourseModules); // open endpoint
router.get("/by-category/:category", authOptional, courseCtrl.getCoursesByCategory);
router.get("/:courseId/outline" , authOptional , courseCtrl.getCourseOutline);

export default router;
