import Suggestion from "../../models/suggestions.schema.js";

export const userSuggestions = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newSuggestion = await Suggestion.create({
      suggestion: message,
      suggestedBy: req.user._id, // ✅ middleware se aa raha hai
    });

    return res.status(201).json({
      message: "Suggestion submitted successfully",
      data: newSuggestion,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to post the suggestion",
      error: error.message,
    });
  }
};
