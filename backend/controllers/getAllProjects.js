import Project from "../models/project.schema.js";

export const getProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const agencyId = req.user._id;
    console.log(agencyId);
    const { search, status } = req.query;

    const skip = (page - 1) * limit;

    const project = {
      createdBy: agencyId,
    };

    if (status) {
      project.projectStatus = status;
    }
    if (search) {
      project.projectName = {
        $regex: search, //jitne bhi name hai unme jo keyword hai wo saare
        $options: "i", //lowercase ya uppercase sare do
      };
    }

    const total = await Project.countDocuments(project);

    const fetchedProject = await Project.find(project)
      .populate("assignedTo", "name email")
      .populate("clientId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: fetchedProject,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit), //9.5 me 10 hi dega(floor 9 deta hai)
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get projects",
      error: error.message,
    });
  }
};
