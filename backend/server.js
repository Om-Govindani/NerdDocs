// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";



const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// CORS (allow client origin)
app.use(cors({
  origin: ["https://nerddocs.vercel.app" , "http://localhost:5173"],
  credentials: true
}));

await connectDB(process.env.MONGO_URL);

// routes
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import moduleRoutes from "./routes/modules.js";
import topicRoutes from "./routes/topics.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import readerRoutes from "./routes/reader.js"
import orderRoutes from "./routes/order.js"
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reader", readerRoutes)
app.use("/api/order" , orderRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
