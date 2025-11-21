import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Create the store and generate the hook
export const useUserStore = create(
    (set, get) => ({
        user: null,
        authenticated: false,
        checkingAuth: true,
        __v: 0,
        login: (newUser) => {
            set({ user: newUser });
        },
        logout: () => set({user: null})
    }),
);

// Updates UI and localStorage (usage of persist middleware)
export const useGameStore = create(
    persist(
        (set, get) => ({
            guesses: [],
            answer: null,
            pokedex: [],
            settings: {},
            __v: 0,
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