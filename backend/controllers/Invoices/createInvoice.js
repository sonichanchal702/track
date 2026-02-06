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
    const PRIMARY = "#1F4FD8";
    const DARK = "#111827";
    const GRAY = "#6B7280";

    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "invoices",
            resource_type: "image",
            format: "pdf",
            public_id: invoiceNumber,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

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

    doc.rect(0, 0, 600, 110).fill(PRIMARY);

    doc.fillColor("white").fontSize(22).text("TRACK AGENCY", 50, 40);

    doc
      .fontSize(14)
      .text("INVOICE", 450, 40, { align: "right" })
      .fontSize(10)
      .text(invoiceNumber, 450, 60, { align: "right" });

    doc.fillColor(DARK);
    doc
      .fontSize(11)
      .text("BILLED TO:", 50, 140)
      .font("Helvetica-Bold")
      .text(project.clientId.name)
      .font("Helvetica")
      .moveDown(0.3)
      .text(`Project: ${project.projectName}`);

    doc
      .fontSize(10)
      .fillColor(GRAY)
      .text(`Date: ${new Date().toDateString()}`, 400, 140)
      .text("Status: UNPAID", 400, 155);

    doc.fillColor(DARK);

    // TABLE HEADER
    const tableTop = 230;

    doc.rect(50, tableTop, 500, 25).fill(PRIMARY);

    doc
      .fillColor("white")
      .fontSize(10)
      .text("DESCRIPTION", 60, tableTop + 7)
      .text("AMOUNT", 450, tableTop + 7, { align: "right" });

    // TABLE ROWS
    let y = tableTop + 35;
    doc.fillColor(DARK);

    items.forEach((item) => {
      doc
        .fontSize(10)
        .text(item.title, 60, y)
        .text(`₹${item.amount}`, 450, y, { align: "right" });
      y += 22;
    });

    // TOTALS
    doc
      .moveTo(350, y + 10)
      .lineTo(550, y + 10)
      .strokeColor(GRAY)
      .stroke();

    doc
      .fontSize(10)
      .fillColor(DARK)
      .text("Subtotal:", 350, y + 20)
      .text(`₹${subTotal}`, 450, y + 20, { align: "right" });

    doc
      .text("Tax:", 350, y + 40)
      .text(`₹${tax}`, 450, y + 40, { align: "right" });

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(PRIMARY)
      .text("TOTAL:", 350, y + 70)
      .text(`₹${totalAmount}`, 450, y + 70, { align: "right" });

    // FOOTER
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(GRAY)
      .text(
        "Thank you for your business. Please complete payment within the due date.",
        50,
        760,
        { align: "center" },
      );

    doc.end(); //MUST be last
  } catch (error) {
    return res.status(500).json({
      message: "Invoice creation failed",
      error: error.message,
    });
  }
};
