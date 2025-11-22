import mongoose from "mongoose";
import { pokemonSchema } from "../schemas/schemas.js";

const gameSchema = new mongoose.Schema({
    guesses: {
        value: [pokemonSchema],
        default: []
    },
    answer: {
        type: pokemonSchema,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    gameState: {
        type: String,
        enum: ["playing", "won", "lost"],
        default: "playing"
    }
}, { versionKey: "version", timestamps: true });

const Game = mongoose.model("Game", gameSchema, "games");
export default Game;