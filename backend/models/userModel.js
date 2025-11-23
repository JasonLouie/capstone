import mongoose from "mongoose";
import Game from "./gameModel.js";
import { pokemonGenerations, pokemonIdMax, pokemonIdMin } from "./pokemonModel.js";

export const pokedexEntrySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        min: pokemonIdMin,
        max: pokemonIdMax
    },
    isShiny: {
        type: Boolean,
        default: false
    },
    time_added: {
        type: Date,
        default: Date.now()
    }
}, { versionKey: false, _id: false });

export const settingsSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ["regular", "silhouette"],
        default: "regular"
    },
    generations: {
        type: [String],
        enums: pokemonGenerations,
        default: [],
        validate: [(val) => val.length <= 9, "Generations array can only contain at most nine generations."]
    },
    allGenerations: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, _id: false });

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Auth"
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
    totalGuesses: { type: Number, default: 0 },
}, { optimisticConcurrency: true, versionKey: "version", toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual("gamesPlayed");

userSchema.post(/^find/, async function (docs, next) {
    try {
        if (docs) {
            // Turn the docs into an array for consistent syntax (result can be 1 or more)
            const userDocs = Array.isArray(docs) ? docs : [docs];
            // User docs are populated with the auth's email field
            const userIds = userDocs.map(doc => doc._id._id);

            // Find the number of games played
            const gameCounts = await Game.aggregate([
                {
                    $match: {
                        userId: {
                            $in: userIds
                        },
                        gameState: {
                            $ne: "playing"
                        }
                    }
                },
                {
                    $group: {
                        _id: "$userId",
                        gamesPlayed: {
                            $sum: 1
                        }
                    }
                }
            ]);

            // Store game count in an obj for easy access (multiple finds = slower performance)
            const gameCountsObj = {};
            gameCounts.forEach(g => gameCountsObj[g._id] = g.gamesPlayed);

            // Set the gamesPlayed field
            userDocs.forEach(doc => {
                doc.set("gamesPlayed", gameCountsObj[doc._id._id] || 0, { strict: false });
            });
        }
        next();
    } catch (err) {
        console.log(e);
        next(e);
    }
})

const User = mongoose.model("User", userSchema, "users");
export default User;