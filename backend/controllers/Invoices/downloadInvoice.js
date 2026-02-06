import Invoice from "../../models/invoice.schema.js";
import axios from "axios";

export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice || !invoice.pdfUrl) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const pdfResponse = await axios.get(invoice.pdfUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`,
    );

    pdfResponse.data.pipe(res);
  } catch (error) {
    console.error("Invoice download error:", error.message);
    res.status(500).json({ message: "Download failed" });
  }
};
