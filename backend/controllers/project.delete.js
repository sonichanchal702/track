import Project from "../models/project.schema.js";

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.user._id;

    const project = await Project.findOneAndDelete({
      _id: id,
      createdBy: agencyId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
};
