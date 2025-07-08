import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected ${connect.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

export default connectDB;