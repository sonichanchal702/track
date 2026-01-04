import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    clientBudget: {
      type: Number,
      required: true,
    },

    teamBudget: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    deadline: Date,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "half_paid", "paid"],
      default: "pending",
    },

    deliverables: {
      type: [String],
      required: true,
    },

    projectStatus: {
      type: String,
      enum: ["lead", "active", "completed", "on_hold"],
      default: "lead",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project" , projectSchema);
export default Project;