import mongoose from "mongoose";

const generations = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar/Hisui", "Paldea"];
const validateTypes = (v) => v.length === 2;

const typeSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ["None", "Normal", "Fighting", "Ghost", "Water", "Fire", "Grass", "Ghost", "Fairy", "Dark", "Steel", "Ground", "Dragon", "Rock", "Poison", "Ice", "Psychic", "Electric", "Bug"],
        required: true
    }
});

const generationSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: generations
    }
});

const pokemonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true,
    },
    generation: {
        type: String,
        enum: generations
    },
    types: {
        type: [typeSchema],
        required: true,
        validate: [validateTypes, "Types array must contain two pokemon types."]
    },
    color: {
        type: String,
        required: true
    },
    stage: {
        type: Number,
        required: true,
        validate: [(v) => Number.isInteger(v) && v >= 1 && v <= 3, "Stage must be a positive integer between 1 and 3 inclusively."]
    },
    height: {
        type: Number,
        required: true,
        validate: [(v) => v > 0, "Height must be greater than 0."]
    },
    weight: {
        type: Number,
        required: true,
        validate: [(v) => v > 0, "Weight must be greater than 0."]
    }
});

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

const pokedexEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true,
    },
    types: {
        type: [typeSchema],
        required: true,
        validate: [validateTypes, "Types array must contain two pokemon types."]
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
        type: stateSchema
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    pokedex: {
        type: [pokedexEntrySchema],
        default: []
    },
    settings: {
        type: settingsSchema
    },
    gamesPlayed: { type: Number, default: 0 },
    totalGuesses: { type: Number, default: 0 },
    version: {
        type: Number,
        default: 1
    }
}, { versionKey: false, timestamps: true });

const Game = mongoose.model("Game", gameSchema, "games")
export default Game;