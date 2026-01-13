import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./connectDB/connectDB.js";
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
  })
);

// routes
app.use("/user", apiLimiter, authRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT} 🚀`);
  });
});
