// models/CourseModule.js
import mongoose from "mongoose";

const CourseModuleSchema = new mongoose.Schema(
  {
    module_id: { type: String, unique: true, required: true },
    course_id: { type: String, required: true, index: true },

    module_title: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CourseModule", CourseModuleSchema);
