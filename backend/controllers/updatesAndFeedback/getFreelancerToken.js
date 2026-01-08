import Project from "../../models/project.schema.js";

export const getFreelancerProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      freelancerAccessToken: req.params.token,
    });

    if (!project) {
      return res.status(404).json({ message: "Invalid freelancer link" });
    }
    res.json(project);
  } catch (error) {
    return res
      .status(500)
      .send("Failed to generate Freelancer Link", error.message);
  }
};
