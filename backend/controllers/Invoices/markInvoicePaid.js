import Invoice from "../../models/invoice.schema.js";

export const markInvoicePaid = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = "paid";
    invoice.paidAt = new Date();
    await invoice.save();

    res.json({ message: "Invoice marked as paid" });
  } catch (error) {
    return res.status(500).send("Something went wrong.");
  }
};
