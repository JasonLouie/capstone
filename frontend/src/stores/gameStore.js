import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { addToGuesses, getGameData, setGameState, updateAnswer } from "../api/userApiCalls";
import { randomPokemon } from "../game";
import { getPokemon } from "../api/pokeApiCalls";

// Updates UI and localStorage (usage of persist middleware)
export const useGameStore = create(
    persist(
        (set, get) => ({
            guesses: [],
            answer: null,
            version: 0,
            gameState: "playing", // playing, won, or lost,
            initGame: async () => {
                if (useUserStore.getState().authenticated) {
                    try {
                        const gameData = await getGameData();
                        if (gameData) {
                            set ({
                                guesses: data.guesses || [],
                                answer: data.answer || null,
                                version: data.version || 0,
                                gameState: data.gameState || "playing"
                            });
                        }
                    } catch (err) {
                        console.err("Failed to fetch game");
                    }
                }
                const { answer, generateNewAnswer } = get();
                if (!answer) {
                    try {
                        await generateNewAnswer();
                    } catch (err) {
                        console.err("Failed to generate new answer");
                    }
                }
            },
            generateNewAnswer: async () => {
                const { settings, authenticated } = useUserStore.getState();
                const randomId = settings.allGenerations ? randomPokemon() : randomPokemon(settings.generations);
                const pokemon = await getPokemon(randomId);
                console.log(pokemon);
                set({ answer: pokemon, guesses: [], gameState: "playing" });

                // Update the answer in db
                if (authenticated) {
                    try {
                        await updateAnswer({answer});
                    } catch (err) {
                        console.error("Failed to sync answer");
                    }
                }
            },
            resetGame: () => {
                set({ guesses: [], answer: null, version: 0, gameState: "playing" });
            },
            endGame: async (value) => {
                set({ gameState: value });
                const { authenticated } = useUserStore.getState();
                if (authenticated) {
                    try {
                        await setGameState({gameState: value});
                    } catch(err) {
                        console.error("Failed to sync the game state");
                    }
                }
            },
            addGuess: async (guess) => {
                set((state) => ({
                    guesses: [...state.guesses, guess]
                }));
                const { authenticated } = useUserStore.getState();
                if (authenticated) {
                    try {
                        await addToGuesses()
                    } catch (err) {
                        console.error("Failed to sync new guess");
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