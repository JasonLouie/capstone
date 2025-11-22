import mongoose from "mongoose";
import { pokedexEntrySchema, settingsSchema } from "../schemas/schemas.js";

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        unique: [true, "Username is taken."],
        required: [true, "Username is required."],
        lowercase: true,
        minLength: [3, "Username must be at least 3 characters long"],
        match: [/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods."],
        validate: {
            validator: function (v) {
                const userModel = this.getQuery ? this.model : this.constructor;
                const userId = this.getQuery ? this.getQuery()._id : this._id;

                return userModel.findOne({ username: v, _id: { $ne: userId } }).then(user => !user);
            },
            message: "Username is taken."
        }
    },
    profilePicUrl: {
        type: String,
        default: ""
    },
    pokedex: {
        type: [pokedexEntrySchema],
        default: []
    },
    settings: {
        type: settingsSchema,
        default: () => ({})
    },
    gamesPlayed: { type: Number, default: 0 },
    totalGuesses: { type: Number, default: 0 },
}, { optimisticConcurrency: true, versionKey: "version" });

const User = mongoose.model("User", userSchema, "users");
export default User;