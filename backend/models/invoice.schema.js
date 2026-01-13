import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        title: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],

    subTotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    paidAt: {
      type: Date,
    },

    pdfUrl: {
      type: String,
    },
  },
  { timestamps: true }
);
invoiceSchema.index({ agencyId: 1, status: 1 });
invoiceSchema.index({ projectId: 1 });
invoiceSchema.index({ paidAt: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
