// models/CourseMeta.js
import mongoose from "mongoose";

const CourseMetaSchema = new mongoose.Schema(
  {
    course_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },

    price: { type: Number, required: true },
    afterDiscountPrice: { type: Number, default: null },

    thumbnailUrl: { type: String },
    description: { type: String },
    
  },
  { timestamps: true }
);

export default mongoose.model("CourseMeta", CourseMetaSchema);
