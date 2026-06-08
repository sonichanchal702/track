import Client from "../models/client.schema.js";
import Project from "../models/project.schema.js";

export const createProject = async (req, res) => {
  try {
    const agencyId = req.user?._id;

    if (!agencyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      projectName,
      clientName,
      phone,
      email,
      clientBudget,
      teamBudget,
      description,
      deadline,
      paymentStatus,
      deliverables,
      projectStatus,
    } = req.body;

    // Validation
    if (
      !projectName?.trim() ||
      !clientName?.trim() ||
      !phone?.trim() ||
      !clientBudget ||
      !deadline ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!Array.isArray(deliverables) || deliverables.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one deliverable is required",
      });
    }

    let client = await Client.findOne({
      userId: agencyId,
      phone,
    });

    if (!client) {
      client = await Client.create({
        userId: agencyId,
        name: clientName,
        phone,
        email,
      });
    }

    const project = await Project.create({
      projectName,
      createdBy: agencyId,
      clientId: client._id,
      clientBudget: Number(clientBudget),
      teamBudget: Number(teamBudget) || 0,
      description,
      deadline,
      deliverables,
      paymentStatus: paymentStatus || "pending",
      projectStatus: projectStatus || "lead",
      freelancerAccessToken: null,
      clientAccessToken: null,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
