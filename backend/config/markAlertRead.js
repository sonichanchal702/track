import Alert from "../models/alert.schema.js";
import Project from "../models/project.schema.js";

export const markAlertRead = async (req, res) => {
  try {
    const agencyId = req.user;
    const { projectId } = req.params;

    // find alert by project id
    const project = await Project.findbyId(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const alerts = await Alert.find(projectId, {
      isRead: true,
    });
  } catch (error) {
    return res.status(500).send("Failed to read alerts", error.message);
  }
};
