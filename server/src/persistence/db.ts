import mongoose from "mongoose";
import { UserRepository } from "../persistence/repositories/UserRepository";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI_PROD || "";

    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected${mongoUri}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
