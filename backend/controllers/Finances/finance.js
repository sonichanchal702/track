import Invoice from "../../models/invoice.schema.js";
import Project from "../../models/project.schema.js";

export const finances = async (req, res) => {
  try {
    const agencyId = req.user.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ---------------- INCOME ----------------
    const paidInvoices = await Invoice.find({
      agencyId,
      status: "paid",
    });

    const totalIncome = paidInvoices.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    const thisMonthIncome = paidInvoices
      .filter((item) => item.paidAt && item.paidAt >= startOfMonth)
      .reduce((sum, item) => sum + item.totalAmount, 0);

    // ---------------- EXPENSES ----------------
    const projects = await Project.find({
      createdBy: agencyId,
      projectStatus: { $in: ["active", "completed"] },
    });

    const totalExpenses = projects.reduce(
      (sum, item) => sum + (item.teamBudget || 0),
      0
    );

    const thisMonthExpenses = projects
      .filter((item) => item.createdAt >= startOfMonth)
      .reduce((sum, item) => sum + (item.teamBudget || 0), 0);

    // ---------------- PROFIT ----------------
    const totalProfit = totalIncome - totalExpenses;
    const thisMonthProfit = thisMonthIncome - thisMonthExpenses;

    return res.status(200).json({
      income: {
        total: totalIncome,
        thisMonth: thisMonthIncome,
      },
      expenses: {
        total: totalExpenses,
        thisMonth: thisMonthExpenses,
      },
      profit: {
        total: totalProfit,
        thisMonth: thisMonthProfit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch finances",
      error: error.message,
    });
  }
};
