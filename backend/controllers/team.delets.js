import Client from "../models/client.schema.js";

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.user._id;

    const client = await Client.findOneAndDelete({
      _id: id,
      userId: agencyId,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete client",
      error: error.message,
    });
  }
};
