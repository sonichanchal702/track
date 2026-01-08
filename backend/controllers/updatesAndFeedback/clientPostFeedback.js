import Project from "../../models/project.schema.js";
import ProjectUpdate from "../../models/projectUpdates.js";

export const clientPostFeedback = async (req, res) => {
  try {
    const { token } = req.params;
    const { message } = req.body;

    const project = await Project.findOne({
      clientAccessToken: token,
    });
    if (!project) {
      return res.status(404).json({ message: "Invalid Clientlink" });
    }
    const update = await ProjectUpdate.create({
      message,
      createdBy: project.createdBy,
      projectId: project._id,
      type: "feedback",
    });
    update.save();
    return res.status(200).json(update);
  } catch (error) {
    return res.status(500).send("Failed to post the feedback", error.message);
  }
};
