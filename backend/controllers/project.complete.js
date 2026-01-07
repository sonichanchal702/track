import Project from "../models/project.schema.js";

export const completeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.user._id;

    const project = await Project.findOne({
      _id: id,
      createdBy: agencyId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.projectStatus === "completed") {
      return res.status(400).json({
        message: "Project is already completed",
      });
    }

    project.projectStatus = "completed";
    await project.save();

    return res.status(200).json({
      message: "Project marked as completed",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to complete project",
      error: error.message,
    });
  }
};
