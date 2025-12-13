// models/UserCourses.js
import mongoose from "mongoose";

const UserCoursesSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    course_id: { type: String, required: true, index: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("UserCourses", UserCoursesSchema);
