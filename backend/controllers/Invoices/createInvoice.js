import Invoice from "../../models/invoice.schema.js";
import Project from "../../models/project.schema.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

export const createInvoice = async (req, res) => {
  try {
    const { projectId, items, tax = 0 } = req.body;

    const project = await Project.findById(projectId).populate("clientId");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const subTotal = items.reduce((sum, i) => sum + i.amount, 0);
    const totalAmount = subTotal + tax;

    const invoiceNumber = "INV-" + crypto.randomBytes(4).toString("hex");

    // -----------------------------
    // 1️⃣ CREATE PDF IN MEMORY
    // -----------------------------
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // -----------------------------
      // 2️⃣ UPLOAD PDF TO CLOUDINARY
      // -----------------------------
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "invoices",
            resource_type: "raw",
            public_id: `${invoiceNumber}.pdf`,
            content_type: "application/pdf", // 🔥 VERY IMPORTANT
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

      // -----------------------------
      // 3️⃣ SAVE INVOICE IN DB
      // -----------------------------
      const invoice = await Invoice.create({
        agencyId: req.user.id,
        projectId,
        clientId: project.clientId._id,
        invoiceNumber,
        items,
        subTotal,
        tax,
        totalAmount,
        pdfUrl: uploadResult.secure_url,
      });

      return res.status(201).json(invoice);
    });

    // -----------------------------
    // PDF CONTENT (CLEAN & SIMPLE)
    // -----------------------------
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice No: ${invoiceNumber}`);
    doc.text(`Client: ${project.clientId.name}`);
    doc.text(`Project: ${project.projectName}`);
    doc.moveDown();

    doc.text("Items:");
    doc.moveDown(0.5);

    items.forEach((item) => {
      doc.text(`${item.title}  —  ₹${item.amount}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${subTotal}`);
    doc.text(`Tax: ₹${tax}`);
    doc.fontSize(14).text(`Total: ₹${totalAmount}`);

    doc.end(); // 🔥 MUST be last
  } catch (error) {
    return res.status(500).json({
      message: "Invoice creation failed",
      error: error.message,
    });
  }
};
