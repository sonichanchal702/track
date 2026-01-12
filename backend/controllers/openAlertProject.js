import Alert from "../models/alert.schema.js";
import Project from "../models/project.schema.js";

export const openAlertProject = async (req, res) => {
  try {
    const { alertId } = req.params;
    const agencyId = req.user;

    const alert = await Alert.findOne(alertId, agencyId);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    //ab alert ko read krn ahia

    await Alert.updateMany(
      {
        agencyId,
        projectId: alert.projectId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );
    //ab project open

    const project = await findByid(alert.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to open project from notification",
    });
  }
};
