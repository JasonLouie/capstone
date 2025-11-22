import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addToGenerations, addToPokedex, logoutUser, removeFromGenerations, resetPokedex, updateBasicSettings } from "../api/userApiCalls";

const defaultSettings = { mode: "regular", allGenerations: true, generations: [] };

// Create the store and generate the hook
export const useUserStore = create(
    persist(
        (set, get) => ({
            // Game session state (Do not save to localStorage)
            user: null,
            authenticated: false,
            checkingAuth: true,
            // Data must persist for guest users
            pokedex: [],
            settings: {...defaultSettings},
            login: (userData) => {
                set({
                    user: userData,
                    authenticated: true,
                    checkingAuth: false,
                    settings: userData.settings || get().settings,
                    pokedex: userData.pokedex || []
                });
            },
            logout: async () => {
                try {
                    await logoutUser();
                } catch (err) {
                    console.log(err);
                } finally {
                    set({ user: null, authenticated: false, settings: {...defaultSettings}, pokedex: [] });
                }
            },
            setCheckingAuth: (status) => set({ checkingAuth: status }),
            // Update settings
            addGeneration: async (generation) => {
                if (!get().settings.generations.includes(generation)) {
                    set((state) => ({ settings: { ...state.settings, generations: [...state.settings.generations, generation] } }));

                    if (get().authenticated) {
                        try {
                            await addToGenerations({generation});
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
                set((state) => ({ settings: { ...state.settings, allGenerations: value }}));
                if (get().authenticated) {
                    try {
                        await updateBasicSettings({ allGenerations: value });
                    } catch (err) {
                        console.error("Failed to sync settings when toggling all generations option", err);
                    }
                }
            },
            updateMode: async (newMode) => {
                set((state) => ({ settings: { ...state.settings, mode: newMode }}));
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
                            await addToPokedex({pokemon});
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
            name: "guest-user-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                settings: state.settings,
                pokedex: state.pokedex
            })
        }
    )
);