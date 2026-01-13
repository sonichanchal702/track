import Invoice from "../../models/invoice.schema.js";

export const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    console.log(invoice);
    if (!invoice || !invoice.pdfPath) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    invoice.download(invoice.pdfPath);
    res.status(200).send("Invoice donwloaded successfully");
  } catch (error) {
    return res.status(500).send("Something went wrong.");
  }
};
