import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
    type: String,
    enum: ["None", "Normal", "Fighting", "Ghost", "Water", "Fire", "Grass", "Ghost", "Fairy", "Dark", "Steel", "Ground", "Dragon", "Rock", "Poison", "Ice", "Psychic", "Electric", "Bug"],
    required: true
});

const pokedexEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imgUrl: {
        type: String,
        required: true,
    },
    types: {
        type: [typeSchema],
        required: true,
        validate: [(val) => val.length === 2, "Types array must contain two pokemon types."]
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

const generationSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar/Hisui", "Paldea"],
    }
});

const settingsSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ["regular", "silhouette"],
        default: "regular"
    },
    generations: {
        type: [generationSchema],
        default: [],
        validate: [(val) => val.length <= 9, "Generations array can only contain at most nine generations."]
    },
    all: {
        type: Boolean,
        default: true
    }
});

const gameSchema = new mongoose.Schema({
    state: {
        type: {},
        default: { guesses: [], answer }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    pokedex: {
        type: [pokedexEntrySchema],
        default: []
    },
    settings: {
        type: { settingsSchema }
    }
}, { versionKey: false, timestamps: true });

const Game = mongoose.model("Game", gameSchema, "games")
export default Game;