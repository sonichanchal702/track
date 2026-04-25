import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    suggestion: {
      type: String,
      required: true,
      trim: true,
    },
    suggestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ string hona chahiye
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;
