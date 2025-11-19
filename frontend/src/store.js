import { create } from "zustand";
import * as storage from "./utils/storage";

// Create the store and generate the hook
export const useUserStore = create((set) => ({
    tokens: storage.getTokens(),
    loginUser: (newTokens) => {
        storage.updateTokens(newTokens);
        set(state => ({ ...state, tokens: newTokens }));
    },
    logoutUser: () => {
        storage.updateTokens(); // Clears token in local storage
        storage.updatePokedex(); // Clears pokedex in local storage
        storage.updateUserImg(); // Clears user img stored in local storage
        set({ tokens: null, pokedex: null });
    },
    userImg: storage.getUserImg() || null,
    initUserImg: (newImg) => {
        storage.updateUserImg(newImg);
        set(state => ({ ...state, userImg: newImg }));
    },
    pokedex: storage.getPokedex() || null,
    initPokedex: (newPokedex) => {
        storage.updatePokedex(newPokedex);
        set(state => ({ ...state, pokedex: [...newPokedex] }));
    },
    pokedexPush: (pokemon) => {
        storage.addEntryToPokedex(pokemon);
        set(state => ({ ...state, pokedex: [...state.pokedex, pokemon] }));
    },
    pokedexReset: () => {
        storage.updatePokedex([]);
        set(state => ({ ...state, pokedex: [] }));
    }
}));