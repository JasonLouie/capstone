import * as pokemonService from "../services/pokemonService.js";

export function getPokemon(req, res, next) {
    try {
        const pokemon = pokemonService.getAllPokemon();
        res.json(pokemon);
    } catch (err) {
        next(err);
    }
}

export async function addPokemon(req, res, next) {
    try {
        await pokemonService.addToPokemonDB(req.body);
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
}