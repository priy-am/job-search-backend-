import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (retries = 5, delay = 3000) => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (retries > 0) {
      console.log(`🔄 Retrying MongoDB connection in ${delay / 1000}s... (${retries} retries remaining)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    }
  }
};

mongoose.connection.on("error", (err) => {
  console.error(`❌ Mongoose Connection Error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected from MongoDB. Reconnecting...");
});

export default connectDB;