import Alert from "../models/alert.schema.js";

export const getUnreadAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      agencyId: req.user.id,
      isRead: false,
    })
      .populate("projectId", "projectName")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch unread alerts",
    });
  }
};
