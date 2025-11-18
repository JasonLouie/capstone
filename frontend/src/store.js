import { create } from "zustand";

// Create the store and generate the hook
export const useUserStore = create((set) => ({
    user: {},
    pokedexPush: (entry) => set(state => ({ user: {...state.user, pokedex: [...pokedex, entry] } })),
    pokedexReset: () => set(state => ({ user: {...state.user, pokedex: [] } }))
}));