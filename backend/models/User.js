import mongoose from "mongoose";

const myCourseSchema = new mongoose.Schema({
  courseName   : { type: String, required: true },
  dateOfBuying : { type: Date, required: true },
  purchaseId   : { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    email           : { type: String, unique: true, required: true },
    isEmailVerified : { type: Boolean, default: false },
    myCourses       : { type: [myCourseSchema], default: [] },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
