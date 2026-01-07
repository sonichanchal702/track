import Project from "../models/project.schema.js";

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.user._id;

    const project = await Project.findOne({
      _id: id,
      createdBy: agencyId,
    })
      .populate("assignedTo")
      .populate("clientId");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      message: "Project details fetched successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};
