import Project from "../../models/project.schema.js";
import ProjectUpdate from "../../models/projectUpdates.js";

export const getClientToken = async (req, res) => {
  try {
    const { token } = req.params;
    const project = await Project.findOne({
      clientAccessToken: token,
    });
    if (!project) {
      return res.status(404).json({ message: "Invalid Clientlink" });
    }
    const timeline = await ProjectUpdate.find({
      projectId: project._id,
    }).sort({ createdAt: -1 });

    res.json({ project, timeline });
  } catch (error) {
    return res.status(500).send("Failed to get Client Link", error.message);
  }
};
