import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getAllPokemon } from "../api/userApiCalls.js";

export const usePokemonStore = create(
    persist(
        (set, get) => ({
            pokemonObject: null,
            initpokemonObject: async () => {
                if (!get().pokemonObject) {
                    try {
                        const allPokemon = await getAllPokemon();
                        const pokemonObject = {};
                        allPokemon.forEach(p => {
                            pokemonObject[p._id] = p;
                        });
                        set({ pokemonObject });
                    } catch (err) {
                        console.error("Error getting all pokemon.");
                        console.log(err);
                    }
                }
            }
        }),
        {
            name: "pokemon-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)