// models/team.schema.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // agency user
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },
    projectsDone: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    payoutPerProject: {
      type: Number, // per project paise
      required: true,
    },

    status: {
      type: String,
      enum: ["free", "busy", "overloaded"],
      default: "free",
    },
  },
  { timestamps: true }
);

// same agency ke andar duplicate contact nahi
teamSchema.index({ agencyId: 1, contact: 1 }, { unique: true });

const Team =  mongoose.model("Team", teamSchema);
export default Team;
