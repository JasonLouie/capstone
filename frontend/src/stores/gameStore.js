import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { addToGuesses, getOrResumeGame, newGame, setGameState, updateAnswer } from "../api/userApiCalls";
import { randomPokemon } from "../utils/game";
import { usePokemonStore } from "./pokemonStore";

// Updates UI and localStorage (usage of persist middleware)
export const useGameStore = create(
    persist(
        (set, get) => ({
            guesses: [],
            answer: null,
            version: 0,
            gameState: "playing", // playing, won, or lost
            settings: useUserStore.getState().settings,
            createNewGame: async () => {
                const { generateNewAnswer, setGame, saveGame } = get();
                const { authenticated, settings } = useUserStore.getState();
                generateNewAnswer();
                if (authenticated) {
                    try {
                        const gameData = await newGame({ settings, answer: get().answer._id });
                        if (gameData) {
                            setGame(gameData);
                        }
                    } catch (err) {
                        console.error("Failed to create game");
                        console.error(err);
                    }
                } else {
                    saveGame();
                }
            },
            saveGame: () => { // Only for guests
                const { guesses = [], answer, settings, gameState, version = 0 } = get();
                const game = { guesses, answer, gameState, settings, version };
                localStorage.setItem(`guest-game-${settings.mode}`, JSON.stringify(game));
            },
            setGame: (gameData) => {
                set({
                    guesses: gameData.guesses || [],
                    answer: gameData.answer ? usePokemonStore.getState().pokemonObject[gameData.answer] || gameData.answer : null,
                    version: gameData.version || 0,
                    gameState: gameData.gameState || "playing",
                    settings: gameData.settings || useUserStore.getState().settings
                });
            },
            initGame: async () => {
                const { generateNewAnswer, setGame, createNewGame } = get();
                const { authenticated, settings } = useUserStore.getState();
                if (authenticated) {
                    try {
                        const gameData = await getOrResumeGame({ settings });
                        if (gameData) {
                            setGame(gameData);
                        }
                    } catch (err) {
                        console.error("Failed to fetch game");
                        console.error(err);
                    }
                } else {
                    const savedData = localStorage.getItem(`guest-game-${settings.mode}`);
                    const localGame = (savedData && savedData != "undefined") ? JSON.parse(savedData) : null;

                    if (localGame) {
                        setGame(localGame);
                    } else {
                        createNewGame();
                        return;
                    }
                }
                if (!get().answer) {
                    generateNewAnswer();
                    if (authenticated) {
                        try {
                            await updateAnswer({ answer: get().answer._id, version: get().version, mode: get().settings.mode });
                            set((state) => ({ version: state.version + 1 }));
                        } catch (err) {
                            console.error("Failed to sync answer");
                            console.log(err);
                        }
                    }
                }
            },
            generateNewAnswer: () => {
                const { settings } = useUserStore.getState();
                const randomId = settings.allGenerations ? randomPokemon() : randomPokemon(settings.generations);
                const pokemon = usePokemonStore.getState().pokemonObject[randomId];
                set({ answer: pokemon, guesses: [], gameState: "playing", settings: { ...settings } });
            },
            endGame: async (value) => {
                const { authenticated, addToPokedex, incrementGamesPlayed } = useUserStore.getState();
                set({ gameState: value });
                if (authenticated) {
                    try {
                        const entry = await setGameState({ gameState: value, version: get().version, mode: get().settings.mode });
                        set((state) => ({ version: state.version + 1 }));
                        if (entry && value == "won") addToPokedex(entry.isShiny, entry.time_added);
                        incrementGamesPlayed();
                    } catch (err) {
                        console.error("Failed to sync the game state");
                        console.log(err);
                    }
                } else {
                    if (value === "won") addToPokedex();
                    get().saveGame(); // Save guest game
                }
            },
            addGuess: async (guess) => {
                const { authenticated, incrementGuessCount } = useUserStore.getState();
                set((state) => ({
                    guesses: [...state.guesses, guess]
                }));
                if (authenticated) {
                    try {
                        await addToGuesses({ guess, version: get().version, mode: get().settings.mode });
                        set((state) => ({ version: state.version + 1 }));
                        incrementGuessCount();
                    } catch (err) {
                        console.error("Failed to sync new guess");
                        console.log(err);
                    }
                } else {
                    get().saveGame(); // Save guest game
                }
            }
        }),
        {
            name: "game-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);