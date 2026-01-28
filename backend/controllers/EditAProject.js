import Project from "../models/project.schema.js";

export const editProject = async (req, res) => {
  try {
    const agencyId = req.user._id;
    const { id } = req.params;

    const allowedFields = [
      "projectName",
      "clientBudget",
      "teamBudget",
      "description",
      "deadline",
      "deliverables",
      "assignedTo",
      "projectStatus",
      "paymentStatus",
    ];

    const project = await Project.findOne({
      _id: id,
      createdBy: agencyId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized",
      });
    }

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        project[key] = req.body[key];
      }
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Edit project error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update project",
    });
  }
};
