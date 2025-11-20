import { create } from "zustand";
import * as storage from "./utils/storage";
import { settingTypes } from "./utils/storage";

// Create the store and generate the hook
export const useUserStore = create((set) => ({
    tokens: storage.getJSON("tokens"),
    loginUser: (newTokens) => {
        storage.updateJSON("tokens", newTokens);
        set(state => ({ ...state, tokens: newTokens }));
    },
    logoutUser: () => {
        ["tokens", "userImg", "pokedex"].forEach(key => storage.clear(key));
        set({ tokens: null, pokedex: null });
    },
    userImg: storage.getString() || null,
    setUserImg: (newImg) => {
        storage.updateString("userImg", newImg);
        set(state => ({ ...state, userImg: newImg }));
    },
    pokedex: storage.getJSON("pokedex", []),
    setPokedex: (newPokedex) => {
        storage.updateJSON("", newPokedex);
        set(state => ({ ...state, pokedex: [...newPokedex] }));
    },
    addToPokedex: (pokemon) => {
        storage.addPokemonEntry("pokedex", pokemon);
        set(state => ({ ...state, pokedex: [...state.pokedex, pokemon] }));
    },
    pokedexReset: () => {
        storage.clear("pokedex");
        set(state => ({ ...state, pokedex: [] }));
    }
}));

export const useGameStore = create((set) => ({
    resetGame: () => {
        ["answer", "guesses"].forEach(key => storage.clear(key));
        set(state => ({...state.settings, answer: null, guesses: []}))
    },
    settings: storage.getJSON("gameSettings", settingTypes.game),
    setGameSettings: (newSettings) => {
        storage.updateJSON("gameSettings", newSettings);
        set(state => ({...state, settings: {...newSettings}}));
    },
    modifyGameSetting: (setting, newValue) => {
        storage.changeSetting("gameSettings", setting, newValue);
        set(state => ({...state, settings: {...state.settings, [setting]: newValue}}));
    },
    answer: storage.getJSON("answer") || null,
    setAnswer: (newAnswer) => {
        storage.updateJSON("answer", newAnswer);
        set(state => ({...state, answer: {...newAnswer}}));
    },
    resetAnswer: () => {
        storage.clear("answer");
        set(state => ({...state, answer: null}));
    },
    guesses: storage.getJSON("guesses", []),
    addToGuesses: (guess) => {
        storage.addPokemonEntry("guesses", guess);
        set(state => ({ ...state, guesses: [guess, ...state.guesses] }));
    }
}));