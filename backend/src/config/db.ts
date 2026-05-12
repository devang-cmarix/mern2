import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const uri: string = process.env.MONGODB_URI ?? "mongodb://localhost:27017/mern-ecommerce";

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection error:", error.message);
    } else {
      console.error("❌ MongoDB connection error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;
