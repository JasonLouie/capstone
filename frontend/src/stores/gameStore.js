import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { getGameData, updateAnswer } from "../api/userApiCalls";
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
                const state = get();
                if (!state.answer) {
                    await state.generateNewAnswer();
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
                    await updateAnswer({answer});
                }
            },
            resetGame: () => {
                
            },
            addGuess: (guess) => {
                set((state) => ({
                    guesses: [...state.guesses, guess]
                }));
            }
        }),
        {
            name: "game-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);