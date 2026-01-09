import Alert from "../../models/alert.schema.js";
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

    const alert = await Alert.create({
      projectId: project._id,
      agencyId: project.createdBy,
      type: "FreelancerUpdate",
      message: `Freelancer posted an update on project ${project.projectName}`,
    });

    return res.status(201).json(update);
  } catch (error) {
    return res.status(500).send("Failed to post update", error.message);
  }
};
