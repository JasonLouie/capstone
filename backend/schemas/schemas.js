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

export const pokemonSchema = new mongoose.Schema({
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

export const pokedexEntrySchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
        validate: [(v) => v >= 1 && v <= 1025, "Id must be between 1 and 1025 inclusively."]
    },
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

export const settingsSchema = new mongoose.Schema({
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