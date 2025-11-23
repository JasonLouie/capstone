import * as pokemonService from "../services/pokemonService.js";

export async function getPokemon(req, res, next) {
    try {
        const pokemon = await pokemonService.getAllPokemon();
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