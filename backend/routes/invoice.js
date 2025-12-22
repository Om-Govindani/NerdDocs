import express from "express";
import { getInvoiceData, sendInvoice }  from "../controllers/invoiceController.js";
import  auth  from "../middleware/auth.js";

const router = express.Router();

router.post("/send/:courseId", auth, sendInvoice);
router.get("/data/:courseId", auth, getInvoiceData); // 👈 NEW


export default router;
