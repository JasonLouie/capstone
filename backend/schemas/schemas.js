import mongoose from "mongoose";

const generations = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar/Hisui", "Paldea"];
const validateTypes = (v) => v.length === 2;
const pokemonIdMin = [1, "Pokemon Id must be greater than or equal to 1."];
const pokemonIdMax= [1025, "Pokemon Id must be less than or equal to 1025"];

const typeSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: ["None", "Normal", "Fighting", "Ghost", "Water", "Fire", "Grass", "Ghost", "Fairy", "Dark", "Steel", "Ground", "Dragon", "Rock", "Poison", "Ice", "Psychic", "Electric", "Bug"],
        required: true
    }
}, { versionKey: false, _id: false });

const generationSchema = new mongoose.Schema({
    value: {
        type: String,
        enum: generations
    }
}, { versionKey: false, _id: false });

export const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
        min: pokemonIdMin,
        max: pokemonIdMax
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
        min: [1, "Stage must be at least 1"],
        validate: [(v) => Number.isInteger(v), "Stage must be an integer."]
    },
    height: {
        type: Number,
        required: true,
        min: [0, "Height must be greater than 0"]
    },
    weight: {
        type: Number,
        required: true,
        min: [0, "Weight must be greater than 0"]
    }
}, { versionKey: false, _id: false });

export const pokedexEntrySchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
        min: pokemonIdMin,
        max: pokemonIdMax
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
    allGenerations: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, _id: false });