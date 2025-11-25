import Fuse from "fuse.js";
import { useMemo } from "react";
import { usePokemonStore } from "../stores/pokemonStore";
import { useGameStore } from "../stores/gameStore";

export function usePokemonSearch(query) {
    const pokemonObject = usePokemonStore(state => state.pokemonObject);
    const { settings, guesses } = useGameStore(state => state);

    const pokemonList = useMemo(() => {
        // Create a set of the pokemon ids that are strictly numbers
        const guessedIds = new Set(guesses.map(g => Number(g)));

        return Object.values(pokemonObject).filter(p => {
            const matchesGen = settings.allGenerations || settings.generations.includes(p.generation);
            const notGuessed = !guessedIds.has(Number(p._id));
    
            return matchesGen && notGuessed;
        });
    }, [pokemonObject, settings.generations, settings.allGenerations, guesses]);

    // Create fuse instance with pokemon list
    const fuse = useMemo(() => {
        const options = {
            keys: ["name"],
            includeScore: true,
            threshold: 0.4
        };
        return new Fuse(pokemonList, options);
    }, [pokemonList]);

    // Perform the search
    const results = useMemo(() => {
        if (!query) return [];

        return fuse.search(query).slice(0, 20).map(r => r.item);
    }, [fuse, query, pokemonList]);

    return results;
}