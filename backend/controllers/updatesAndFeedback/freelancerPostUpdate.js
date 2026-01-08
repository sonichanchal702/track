import Project from "../../models/project.schema.js";
import ProjectUpdate from "../../models/projectUpdates.js";

export const freelancerPostUpdate = async (req, res) => {
  try {
    const { token } = req.params;
    const { message } = req.body;

    const project = await Project.findOne({
      freelancerAccessToken: token,
    });
    if (!project) {
      return res.status(404).json({ message: "Invalid link" });
    }

    const update = await ProjectUpdate.create({
      createdBy: project.assignedTo,
      message,
      projectId: project._id,
      type: "update",
    });
    await update.save();
    return res.status(201).json(update);
  } catch (error) {
    return res.status(500).send("Failed to post update", error.message);
  }
};
