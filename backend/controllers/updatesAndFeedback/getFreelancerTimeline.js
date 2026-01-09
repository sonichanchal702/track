import { getProjectTimeline } from "./timeline.js";
import Project from "../../models/project.schema.js";
export const getFreelancerTimeline = async (req, res) => {
  const project = await Project.findOne({
    freelancerAccessToken: req.params.token,
  });

  if (!project) {
    return res.status(404).json({ message: "Invalid link" });
  }

  req.params.id = project._id;
  return getProjectTimeline(req, res);
};
