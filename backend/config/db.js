import mongoose from "mongoose";

export default async function connectDB(uri) {
  mongoose.set("strictQuery", false);
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
}
