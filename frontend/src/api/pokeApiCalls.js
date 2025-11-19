import pokeApi from "../configs/pokeApi";
import { findGeneration } from "../game";
import { titleCase } from "../utils/funcs";

function filterPokemonData(data) {
    return {
        id: data.id,
        img: data.sprites.front_default,
        name: titleCase(data.name),
        generation: findGeneration(data.id),
        height: data.height,
        weight: data.weight,
        types: data.types.map(t=> titleCase(t.type.name))
    };
}

// The API accepts id or name for this endpoint
export async function getPokemon(idOrName) {
    const pokemon = await pokeApi.get(`/pokemon/${idOrName}`);
    return filterPokemonData(pokemon.data);
}