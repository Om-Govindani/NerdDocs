// models/TopicContent.js
import mongoose from "mongoose";

const ContentBlockSchema = new mongoose.Schema({
  content_id: { type: String, required: true }, // C01M01T01C01
  type: { type: String, required: true }, // paragraph, heading, list, diagram, code
  value: String,
  level: Number,
  items: [String],
  url: String,
  caption: String,
});

const TopicContentSchema = new mongoose.Schema(
  {
    topic_id: { type: String, required: true, index: true },
    blocks: [ContentBlockSchema],
  },
  { timestamps: true }
);

export default mongoose.model("TopicContent", TopicContentSchema);
