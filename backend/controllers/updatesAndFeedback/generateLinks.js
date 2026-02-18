import crypto from "crypto";
import Project from "../../models/project.schema.js";

export const generateLinks = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Pehle Project ko find karo
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Check karo ki tokens pehle se hain ya nahi
    if (project.freelancerAccessToken && project.clientAccessToken) {
      // Agar hain, toh wahi purane wale return kar do
      return res.status(200).json({
        freelancerToken: project.freelancerAccessToken,
        clientToken: project.clientAccessToken,
        message: "Existing tokens retrieved", // Optional message for debugging
      });
    }

    // 3. Agar nahi hain, tabhi naye generate karo
    const freelancerToken = crypto.randomBytes(16).toString("hex");
    const clientToken = crypto.randomBytes(16).toString("hex");

    // 4. DB mein update karo
    project.freelancerAccessToken = freelancerToken;
    project.clientAccessToken = clientToken;

    await project.save();

    // Naye wale return karo
    res.status(200).json({
      freelancerToken: freelancerToken,
      clientToken: clientToken,
      message: "New tokens generated",
    });
  } catch (error) {
    console.error("Link Generation Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate Tokens", error: error.message });
  }
};
