import Alert from "../../models/alert.schema.js";

export const getAlerts = async (req, res) => {
  try {
    const agencyId = req.user;
    const alerts = await Alert.find({
      agencyId,
    })
      .populate("projectId", "projectName")
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    return res.status(500).send("Failed to get alerts", error.message);
  }
};
