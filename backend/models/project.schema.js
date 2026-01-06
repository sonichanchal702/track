import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    // agency ka
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // auto create the client;
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // budgets
    clientBudget: {
      type: Number,
      required: true,
    },

    teamBudget: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    deadline: {
      type: Date,
    },

    deliverables: {
      type: [String], // ["website", "logo", "video"]
      default: [],
    },

    // freelancer / team member
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    projectStatus: {
      type: String,
      enum: ["lead", "active", "completed", "on_hold"],
      default: "lead",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "half_paid", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
