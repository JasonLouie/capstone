import { create } from "zustand";
import * as storage from "./utils/storage";

const settingTypes = {user: {}, game: {mode: "regular", generations: ["all"], time: "unlimited"}};

// Create the store and generate the hook
export const useUserStore = create((set) => ({
    tokens: storage.getJSON("tokens"),
    loginUser: (newTokens) => {
        storage.updateJSON("tokens", newTokens);
        set(state => ({ ...state, tokens: newTokens }));
    },
    logoutUser: () => {
        storage.clear("tokens"); // Clears token in local storage
        storage.clear("pokedex"); // Clears pokedex in local storage
        storage.clear("userImg"); // Clears user img stored in local storage
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
    settings: storage.getJSON("gameSettings", settingTypes.game),
    setGameSettings: (newSettings) => {
        storage.updateJSON("gameSettings", newSettings);
        set(state => ({...state, settings: {...newSettings}}));
    },
    modifyGameSettings: (setting, newValue) => {
        storage.changeSetting("gameSettings", setting, value);
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