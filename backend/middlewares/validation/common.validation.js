import mongoose from "mongoose";

// Mongo ObjectId regex validation
export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Invalid ${paramName}`,
      });
    }

    next();
  };
};

export const validateStatus = (allowedStatus = []) => {
  return (req, res, next) => {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({
        message: "Status query is required",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatus.join(", ")}`,
      });
    }

    next();
  };
};


export const validateToken = () => {
  return (req, res, next) => {
    const { token } = req.params;

    // basic safety: alphanumeric + length check
    const tokenRegex = /^[a-zA-Z0-9-_]{20,}$/;

    if (!token || !tokenRegex.test(token)) {
      return res.status(400).json({
        message: "Invalid or malformed token",
      });
    }

    next();
  };
};

