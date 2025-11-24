import mongoose from "mongoose";
import { settingsSchema } from "./userModel.js";

const gameSchema = new mongoose.Schema({
    guesses: {
        type: [Number],
        default: []
    },
    answer: {
        type: Number,
        default: null
    },
    gameState: {
        type: String,
        enum: ["playing", "won", "lost"],
        default: "playing"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    settings: {
        type: settingsSchema,
        default: () => ({})
    }
}, { versionKey: "version", timestamps: true });

const Game = mongoose.model("Game", gameSchema, "games");
export default Game;