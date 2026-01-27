import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: String,

    phone: {
      type: String,
      required: true,
    },

    email: String,
  },
  { timestamps: true },
);

clientSchema.index({ userId: 1, phone: 1 }, { unique: true });

const Client = mongoose.model("Client", clientSchema);
export default Client;
