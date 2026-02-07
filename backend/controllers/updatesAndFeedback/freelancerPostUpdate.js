import Alert from "../../models/alert.schema.js";
import Project from "../../models/project.schema.js";
import ProjectUpdate from "../../models/projectUpdates.js";

export const freelancerPostUpdate = async (req, res) => {
  try {
    const { token } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    //  Find project by token
    const project = await Project.findOne({
      freelancerAccessToken: token,
    });

    if (!project) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    // Create project update
    const update = await ProjectUpdate.create({
      projectId: project._id,
      actorType: "freelancer",
      actorId: project.assignedTo,
      type: "update",
      message,
    });

    // Create alert
    await Alert.create({
      projectId: project._id,
      agencyId: project.createdBy,
      type: "FreelancerUpdate",
      message: `Freelancer posted an update on "${project.projectName}"`,
    });

    return res.status(201).json({
      success: true,
      data: update,
    });
  } catch (error) {
    console.error("Freelancer update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post update",
    });
  }
};
