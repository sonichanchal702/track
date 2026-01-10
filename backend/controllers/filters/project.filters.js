import Project from "../../models/project.schema.js";

export const filterProjectsByStatus = async (req, res) => {
  try {
    const agencyId = req.user._id;
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({ message: "Status query is required" });
    }

    const projects = await Project.find({
      createdBy: agencyId,
      projectStatus: status,
    });

    return res.status(200).json({
      message: `Projects with status '${status}' fetched successfully`,
      count: projects.length,
      projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to filter projects",
      error: error.message,
    });
  }
};
