import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { addToGuesses, getOrResumeGame, newGame, setGameState, updateAnswer } from "../api/userApiCalls";
import { randomPokemon } from "../game";
import { usePokemonStore } from "./pokemonStore";

// Updates UI and localStorage (usage of persist middleware)
export const useGameStore = create(
    persist(
        (set, get) => ({
            guesses: [],
            answer: null,
            version: 0,
            gameState: "playing", // playing, won, or lost
            settings: null,
            createNewGame: async () => {
                get().generateNewAnswer();
                const { authenticated, settings } = useUserStore.getState();
                const { pokemonObject } = usePokemonStore.getState();
                if (authenticated) {
                    try {
                        const gameData = await newGame({ settings, answer: get().answer._id });
                        if (gameData) {
                            set({
                                guesses: gameData.guesses,
                                answer: gameData.answer ? pokemonObject[gameData.answer] : null,
                                version: gameData.version,
                                gameState: gameData.gameState,
                                settings: gameData.settings
                            });
                        }
                        console.log(settings);
                    } catch (err) {
                        console.error("Failed to create game");
                        console.error(err);
                    }
                }
            },
            initGame: async () => {
                const { generateNewAnswer } = get();
                const { authenticated, settings } = useUserStore.getState();
                const { pokemonObject } = usePokemonStore.getState();
                if (authenticated) {
                    try {
                        const gameData = await getOrResumeGame({ settings });
                        if (gameData) {
                            set({
                                guesses: gameData.guesses,
                                answer: gameData.answer ? pokemonObject[gameData.answer] : null,
                                version: gameData.version,
                                gameState: gameData.gameState,
                                settings: gameData.settings
                            });
                        }
                    } catch (err) {
                        console.error("Failed to fetch game");
                        console.error(err);
                    }
                }
                if (!get().answer) {
                    generateNewAnswer();
                    try {
                        console.log("Attempting to sync answer...");
                        await updateAnswer({ answer: pokemon._id, version: get().version });
                        set((state) => ({ version: state.version + 1 }));
                    } catch (err) {
                        console.error("Failed to sync answer");
                        console.log(err);
                    }
                }
            },
            generateNewAnswer: () => {
                const { settings } = useUserStore.getState();
                const randomId = settings.allGenerations ? randomPokemon() : randomPokemon(settings.generations);
                const pokemon = usePokemonStore.getState().pokemonObject[randomId];
                console.log(pokemon);
                set({ answer: pokemon, guesses: [], gameState: "playing", settings: { ...settings } });
            },
            endGame: async (value) => {
                set({ gameState: value });
                if (useUserStore.getState().authenticated) {
                    try {
                        await setGameState({ gameState: value, version: get().version });
                        set((state) => ({ version: state.version + 1 }));
                    } catch (err) {
                        console.error("Failed to sync the game state");
                    }
                }
            },
            addGuess: async (guess) => {
                set((state) => ({
                    guesses: [...state.guesses, guess]
                }));
                if (useUserStore.getState().authenticated) {
                    try {
                        await addToGuesses({ guess, version: get().version });
                        set((state) => ({ version: state.version + 1 }));
                    } catch (err) {
                        console.error("Failed to sync new guess");
                        console.log(err);
                    }
                }
            }
        }),
        {
            name: "game-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);