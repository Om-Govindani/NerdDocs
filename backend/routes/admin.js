import express from "express";
import auth from "../middleware/auth.js";
import * as adminCtrl from "../controllers/adminController.js";
const router = express.Router();
// add admin-check middleware in production
router.post("/course", auth, adminCtrl.createCourse);
router.post("/module", auth, adminCtrl.createModule);
export default router;
