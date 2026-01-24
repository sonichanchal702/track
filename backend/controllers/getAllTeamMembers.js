import Team from "../models/team.schema.js";

export const getAllTeamMembers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const agencyId = req.user._id;

    const { search, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { agencyId };

    if (status) filter.status = status;

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const total = await Team.countDocuments(filter);

    const teamMembers = await Team.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      data: teamMembers,
      pagination: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get team members",
      error: error.message,
    });
  }
};
