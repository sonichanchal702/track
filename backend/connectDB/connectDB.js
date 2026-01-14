import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 10, // Max 10 connections khule rahenge
      serverSelectionTimeoutMS: 5000, // 5 sec mein connect nahi hua toh error
    });
    console.log("MongoDB Connected successfully✅");
  } catch (error) {
    console.log("MongoDB connection failed ❌");
    process.exit(1);
  }
};

export default connectDB;
