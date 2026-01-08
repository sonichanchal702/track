import Client from "../models/client.schema.js";
import Project from "../models/project.schema.js";

export const createProject = async (req, res) => {
  try {
    const agencyId = req.user._id;
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
    if (
      !projectName ||
      !clientName ||
      !phone ||
      !clientBudget ||
      !deliverables ||
      !deadline ||
      !description
    ) {
      return res.status(400).send("Enter required fielsds");
    }

    //   find/create the client.
    let client = await Client.findOne({
      userId: agencyId,
      phone,
    });

    //if no client found to create new Client
    if (!client) {
      let newClient = new Client({
        userId: agencyId,
        name: clientName,
        phone,
        email,
      });
      await newClient.save(); //saving the client in db
    }
    //create neww proejct;
    const newProject = new Project({
      projectName,
      createdBy: agencyId,
      clientId: client._id,
      clientBudget,
      teamBudget,
      description,
      deadline,
      deliverables,
      paymentStatus,
      freelancerAccessToken: null,
      clientAccessToken: null,
      projectStatus: "lead",
    });
    await newProject.save(); //saving the project in db;

    return res.status(201).json({
      message: "Project created successfully",
      newProject,
    });
  } catch (error) {
    return res.status(401).send("ERROR OCCURED: " + error.message);
  }
};
