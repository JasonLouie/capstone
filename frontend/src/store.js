import { create } from "zustand";

// Create the store and generate the hook
export const useUserStore = create((set) => ({
    loggedIn: false,
    loginUser: () => set(state => ({loggedIn: true})),
    logoutUser: () => set(state => ({loggedIn: false, pokedex: []})),
    pokedex: [],
    initPokedex: (newPokedex) => set(state => ({pokedex: [...newPokedex]})),
    pokedexPush: (entry) => set(state => ({ pokedex: [...state.pokedex, entry] } )),
    pokedexReset: () => set(state => ({ pokedex: [] }))
}));