import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./connectDB/connectDB.js";
import "./config/checkDeadlines.js";
import authRoutes from "./routes/user.auth.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

dotenv.config({ quiet: true });

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  }),
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
});

// routes
app.use("/user", authRoutes); //apiLimiter lgana hai.

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} 🚀`);
  });
});
