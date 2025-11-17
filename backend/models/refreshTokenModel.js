import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: "7d"
    }
}, {versionKey: false, timestamp: false});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema, "refresh_tokens");
export default RefreshToken;