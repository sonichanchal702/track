import Alert from "../../models/alert.schema.js";

export const readAlert = async (req, res) => {
  try {
    const alerts = await Alert.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });
    alerts.save();
    res.json({ message: "Alert marked as read" });
  } catch (error) {
    return res.status(500).send("Failed to get alerts", error.message);
  }
};
