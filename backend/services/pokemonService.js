import Pokemon from "../models/pokemonModel.js";

export async function addToPokemonDB(body) {
    const { id, ...data } = body.guess;
    await Pokemon.create({_id: id, ...data});
}

export async function getAllPokemon() {
    const pokemon = await Pokemon.find({});
    return pokemon;
}