import Invoice from "../../models/invoice.schema.js";

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      agencyId: req.user._id,
    })
      .populate("projectId", "projectName")
      .populate("clientId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};
