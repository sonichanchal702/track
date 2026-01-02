import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected successfully✅");
  } catch (error) {
    console.log("MongoDB connection failed ❌");
    process.exit(1);
  }
};

export default connectDB;
