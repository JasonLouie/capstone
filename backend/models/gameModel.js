import mongoose from "mongoose";
import { pokemonSchema } from "../schemas/schemas.js";

const stateSchema = new mongoose.Schema({
    guesses: {
        value: [pokemonSchema],
        default: []
    },
    answer: {
        type: pokemonSchema,
        default: null
    }
}, { versionKey: false, _id: false });

const gameSchema = new mongoose.Schema({
    state: {
        type: stateSchema,
        default: () => ({})
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    }
}, { versionKey: "version", timestamps: true });

const Game = mongoose.model("Game", gameSchema, "games");
export default Game;