import mongoose from "mongoose";
import { pokemonSchema } from "../schemas/schemas.js";
import User from "./userModel.js";

const stateSchema = new mongoose.Schema({
    guesses: {
        value: [pokemonSchema],
        default: []
    },
    answer: {
        type: pokemonSchema,
        default: null
    }
});

const gameSchema = new mongoose.Schema({
    state: {
        type: stateSchema
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    version: {
        type: Number,
        default: 1
    }
}, { versionKey: false, timestamps: true });

gameSchema.pre("save", async function (next) {

    if (this.isNew) return next();

    if (this.isModified("state") && this.version > 1) {
        await User.findByIdAndUpdate(this.userId, { $inc: { totalGuesses: 1, version: 1 } } );
    }

    if (this.isModified() && this.version === 1) {
        await User.findByIdAndUpdate(this.userId, { $inc: { totalGuesses: 1, version: 1, gamesPlayed: 1 } } );
    }

    next();
});

const Game = mongoose.model("Game", gameSchema, "games");
export default Game;