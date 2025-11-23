import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./userStore";
import { addToGuesses, getOrCreateGameData, setGameState, updateAnswer } from "../api/userApiCalls";
import { randomPokemon } from "../game";
import { usePokemonStore } from "./pokemonStore";

const staticMon = {
    color: "Blue",
    generation: "Hoenn",
    height: 59.055,
    id: 295,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/295.png",
    name: "Exploud",
    stage: 3,
    types: ['Normal', 'None'],
    weight: 185.1
};

// Updates UI and localStorage (usage of persist middleware)
export const useGameStore = create(
    persist(
        (set, get) => ({
            guesses: [],
            answer: null,
            mode: "regular",
            version: 0,
            gameState: "playing", // playing, won, or lost,
            initGame: async () => {
                const { generateNewAnswer } = get();
                const { settings, authenticated } = useUserStore.getState();
                const { pokemonObject } = usePokemonStore.getState();
                if (authenticated) {
                    try {
                        const gameData = await getOrCreateGameData({ mode: settings.mode });
                        if (gameData) {
                            set ({
                                guesses: gameData.guesses || [],
                                mode: gameData.mode || "regular",
                                answer: gameData.answer ? pokemonObject[gameData.answer] : null,
                                version: gameData.version || 0,
                                gameState: gameData.gameState || "playing"
                            });
                        }
                    } catch (err) {
                        console.error("Failed to fetch game");
                        console.error(err);
                    }
                }
                if (!get().answer) {
                    try {
                        await generateNewAnswer();
                    } catch (err) {
                        console.error("Failed to generate new answer");
                        console.log(err);
                    }
                }
            },
            generateNewAnswer: async () => {
                const { settings } = useUserStore.getState();
                const randomId = settings.allGenerations ? randomPokemon() : randomPokemon(settings.generations);
                const pokemon = usePokemonStore.getState().pokemonObject[randomId];
                console.log(pokemon);
                set({ answer: pokemon, guesses: [], gameState: "playing", mode: settings.mode });

                // Update the answer in db
                if (useUserStore.getState().authenticated) {
                    try {
                        console.log("Attempting to sync answer...");
                        await updateAnswer({answer: pokemon._id, version: get().version});
                        set((state) => ({version: state.version+1}));
                    } catch (err) {
                        console.error("Failed to sync answer");
                        console.log(err);
                    }
                }
            },
            endGame: async (value) => {
                set({ gameState: value });
                if (useUserStore.getState().authenticated) {
                    try {
                        await setGameState({gameState: value, version: get().version});
                        set((state) => ({version: state.version+1}));
                    } catch(err) {
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
                        await addToGuesses({guess, version: get().version});
                        set((state) => ({version: state.version+1}));
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