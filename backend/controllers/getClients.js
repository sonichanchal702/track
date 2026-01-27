import Client from "../models/client.schema.js";

export const getClients = async (req, res) => {
  try {
    const agencyId = req.user._id;

    const clients = await Client.find({ userId: agencyId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: clients.length
        ? "Clients fetched successfully"
        : "No clients found",
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error("Get Clients Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};
