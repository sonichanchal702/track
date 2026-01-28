import Project from "../models/project.schema.js";
import Client from "../models/client.schema.js";

export const viewAClient = async (req, res) => {
  try {
    const agencyId = req.user._id;
    const { id } = req.params;

    const client = await Client.findOne({
      _id: id,
      userId: agencyId,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const projects = await Project.find({
      clientId: client._id,
      createdBy: agencyId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Client & projects fetched",
      client,
      projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch client data",
      error: error.message,
    });
  }
};
