import mongoose from "mongoose";

const pokemonTypes = ["None", "Normal", "Fighting", "Ghost", "Water", "Fire", "Grass", "Fairy", "Dark", "Steel", "Ground", "Dragon", "Rock", "Poison", "Ice", "Psychic", "Electric", "Bug", "Flying"];
export const pokemonGenerations = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar/Hisui", "Paldea"];
export const pokemonIdMin = [1, "Pokemon Id must be greater than or equal to 1."];
export const pokemonIdMax = [1025, "Pokemon Id must be less than or equal to 1025"];

const pokemonSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        min: pokemonIdMin
    },
    name: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    generation: {
        type: String,
        enum: pokemonGenerations
    },
    types: {
        type: [String],
        enum: pokemonTypes,
        required: true,
        validate: [(v) => v.length === 2, "Types array must contain two pokemon types."]
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
}, { versionKey: false, _id: false, id: false });

const Pokemon = mongoose.model("Pokemon", pokemonSchema, "pokemon");
export default Pokemon;