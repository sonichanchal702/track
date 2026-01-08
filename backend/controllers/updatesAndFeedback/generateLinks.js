import crypto from "crypto";
import Project from "../../models/project.schema.js";

export const generateLinks = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerToken = crypto.randomBytes(16).toString("hex");
    const clientToken = crypto.randomBytes(16).toString("hex");

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        freelancerAccessToken: freelancerToken,
        clientAccessToken: clientToken,
      },
      { new: true }
    );

    res.json({
      freelancerToken: `/freelancer/project/${freelancerToken}`,
      clientToken: `/client/project/${clientToken}`,
    });
  } catch (error) {
    return res.status(500).send("Failed to generate Tokens", error.message);
  }
};
