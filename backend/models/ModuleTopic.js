// models/ModuleTopic.js
import mongoose from "mongoose";

const ModuleTopicSchema = new mongoose.Schema(
  {
    topic_id: { type: String, unique: true, required: true }, // C01M01T01
    module_id: { type: String, required: true, index: true },

    topic_name: { type: String, required: true },
    order: { type: Number, required: true },

    code_snippet: {
      title: String,
      language: String,
      code: String,
    },

    assignment: {
      type: {
        type: String,
        enum: ["programming", "theory"],
      },
      question: String,
      expected_output_hint: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ModuleTopic", ModuleTopicSchema);
