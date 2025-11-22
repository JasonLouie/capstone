import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addToGenerations, addToPokedex, getUserData, logoutUser, removeFromGenerations, resetPokedex, updateBasicSettings } from "../api/userApiCalls";
import { useGameStore } from "./gameStore";

const defaultSettings = { mode: "regular", allGenerations: true, generations: [] };

// Create the store and generate the hook
export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            authenticated: false,
            checkingAuth: false,
            pokedex: [],
            settings: { ...defaultSettings },
            login: (userData) => {
                set({
                    user: userData,
                    authenticated: true,
                    checkingAuth: false,
                    settings: userData.settings || get().settings,
                    pokedex: userData.pokedex || []
                });
            },
            checkAuth: async () => {
                set({checkingAuth: true});
                try {
                    const user = await getUserData();
                    set({
                        user,
                        authenticated: true,
                        checkingAuth: false,
                        settings: user.settings || get().settings,
                        pokedex: user.pokedex || []
                    });
                } catch (err) {
                    console.log(err);
                    // Cookie error (missing/invalid) even after refresh req was sent
                    set({ user: null, authenticated: false, checkingAuth: false });
                }
            },
            logout: async () => {
                try {
                    await logoutUser();
                } catch (err) {
                    console.log(err);
                } finally {
                    set({ user: null, authenticated: false, settings: { ...defaultSettings }, pokedex: [] });
                    useGameStore.setState({ guesses: [], answer: null, version: 0, gameState: "playing" });
                }
            },
            // Update settings
            addGeneration: async (generation) => {
                if (!get().settings.generations.includes(generation)) {
                    set((state) => ({ settings: { ...state.settings, generations: [...state.settings.generations, generation] } }));

                    if (get().authenticated) {
                        try {
                            await addToGenerations({ generation });
                        } catch (err) {
                            console.error("Failed to add generation", err);
                        }
                    }
                }
            },
            removeGeneration: async (generation) => {
                if (get().settings.generations.includes(generation)) {
                    set((state) => ({ settings: { ...state.settings, generations: state.settings.generations.filter(g => g !== generation) } }));

                    if (get().authenticated) {
                        try {
                            await removeFromGenerations(generation);
                        } catch (err) {
                            console.error("Failed to remove generation", err);
                        }
                    }
                }
            },
            toggleAllGenerations: async (value) => {
                set((state) => ({ settings: { ...state.settings, allGenerations: value } }));
                if (get().authenticated) {
                    try {
                        await updateBasicSettings({ allGenerations: value });
                    } catch (err) {
                        console.error("Failed to sync settings when toggling all generations option", err);
                    }
                }
            },
            updateMode: async (newMode) => {
                set((state) => ({ settings: { ...state.settings, mode: newMode } }));
                if (get().authenticated) {
                    try {
                        await updateBasicSettings({ mode: newMode });
                    } catch (err) {
                        console.error("Failed to sync settings when updating mode", err);
                    }
                }
            },
            // Add entry pokedex
            addPokedexEntry: async (pokemon) => {
                if (!get().pokedex.includes(pokemon)) {
                    set((state) => ({ pokedex: [...state.pokedex, pokemon] }));
                    if (get().authenticated) {
                        try {
                            await addToPokedex({ pokemon });
                        } catch (err) {
                            console.error("Failed to sync pokedex", err);
                        }
                    }
                }
            },
            // Reset pokedex
            resetUserPokedex: async () => {
                set({ pokedex: [] });
                if (get().authenticated) {
                    try {
                        await resetPokedex();
                    } catch (err) {
                        console.error("Failed to sync pokedex", err);
                    }
                }
            }
        }),
        {
            name: "user-preferences-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);