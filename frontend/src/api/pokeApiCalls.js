import pokeApi from "../configs/pokeApi";
import { findGeneration } from "../game";
import { titleCase } from "../utils/funcs";

async function filterPokemonData(info, species) {
    const pokemon = {
        id: info.id,
        img: info.sprites.front_default,
        name: titleCase(info.name, "-"),
        generation: findGeneration(info.id),
        color: titleCase(species.color.name),
        height: info.height,
        weight: info.weight,
        types: [titleCase(info.types[0]?.type.name || "None"), titleCase(info.types[1]?.type.name || "None")]
    };

    if (species.evolution_chain) {
        const chainId = species.evolution_chain.url.split("/")[6];
        pokemon.stage = await getEvolutionStage(chainId, info.name);
    } else {
        pokemon.stage = 1;
    }
    return pokemon;
}

async function getEvolutionStage(chainId, name) {
    const { data } = await pokeApi.get(`/evolution-chain/${chainId}`);
    return calculateEvolutionStage(data.chain, name);
}

// The API accepts id or name for this endpoint
export async function getPokemon(idOrName) {
    const [pokemon, species] = await Promise.all([pokeApi.get(`/pokemon/${idOrName}`), pokeApi.get(`/pokemon-species/${idOrName}`)]);
    
    return await filterPokemonData(pokemon.data, species.data);
}

function calculateEvolutionStage(chain, targetName) {
    // Stage 1:
    if (chain.species.name === targetName) return 1;

    // Stage 2:
    const stage2 = chain.evolves_to.find(c => c.species.name === targetName);
    if (stage2) return 2;

    return 3; // Must be a 3rd evolution.
}