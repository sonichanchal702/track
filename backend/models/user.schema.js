import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    agencyName: {
      type: String,
      unique: true,
      sparse: true, // freelancers ke liye optional
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    projectsDone: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
      },
    ],
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clients",
      },
    ],
    freelancers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "freelancers",
      },
    ],
  },
  {
    timestamps: true, // createdAt + updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

export default User;
