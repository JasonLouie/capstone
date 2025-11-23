import mongoose from "mongoose";

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
    mode: {
        type: String,
        enum: ["regular", "silhouette"],
        default: "regular"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { versionKey: "version", timestamps: true });

const Game = mongoose.model("Game", gameSchema, "games");
export default Game;