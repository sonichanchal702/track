import mongoose from "mongoose";

const projectUpdateSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    actorType: {
      type: String,
      enum: ["agency", "freelancer", "client", "system"],
      required: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["update", "feedback", "system"],
      required: true,
    },
  },
  { timestamps: true },
);  

const ProjectUpdate = mongoose.model("projectUpdate", projectUpdateSchema);
export default ProjectUpdate;
