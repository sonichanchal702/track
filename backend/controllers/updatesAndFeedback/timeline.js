import ProjectUpdate from "../../models/projectUpdates.js";

export const getProjectTimeline = async (req, res) => {
  try {
    const updates = await ProjectUpdate.find({
      projectId: req.params.id,
    })
      .populate("actorId")
      .sort({ createdAt: -1 });

    res.json(updates);
  } catch (error) {
    return res
      .status(500)
      .send("Failed to get Updates Timeline", error.message);
  }
};
