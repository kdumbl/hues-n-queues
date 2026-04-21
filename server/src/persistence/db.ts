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

  //test stuff

  const x = await UserRepository.findById("698a90810c302758bb2c7077");
  console.log(x);
};

export default connectDB;
