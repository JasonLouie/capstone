import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
}