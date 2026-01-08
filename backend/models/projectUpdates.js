import mongoose from "mongoose";

const projectUpdateSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["update", "feedback"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectUpdate = mongoose.model("projectUpdate", projectUpdateSchema);
export default ProjectUpdate;
