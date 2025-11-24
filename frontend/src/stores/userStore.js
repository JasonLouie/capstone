import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addToGenerations, deleteUser, getUserData, logoutUser, modifyEmail, modifyPassword, removeFromGenerations, resetPokedex, updateBasicSettings, updateUserFields } from "../api/userApiCalls";
import { useGameStore } from "./gameStore";

export const defaultSettings = { mode: "regular", allGenerations: true, generations: [] };

// Create the store and generate the hook
export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            authenticated: false,
            checkingAuth: false,
            pokedex: [],
            settings: { ...defaultSettings },
            resetUser: () => {
                set({ user: null, authenticated: false, settings: { ...defaultSettings }, pokedex: [] });
                useGameStore.getState().initGame();
            },
            login: (userData) => {
                const { settings, pokedex, ...user } = userData;
                set({
                    user,
                    authenticated: true,
                    checkingAuth: false,
                    settings: settings || get().settings,
                    pokedex: pokedex || []
                });
                useGameStore.getState().initGame();
            },
            checkAuth: async () => {
                set({ checkingAuth: true });
                try {
                    const userData = await getUserData();
                    const { settings, pokedex, ...user } = userData;
                    set({
                        user,
                        authenticated: true,
                        checkingAuth: false,
                        settings: settings || get().settings,
                        pokedex: pokedex || []
                    });
                } catch (err) {
                    console.log(err);
                    // Cookie error (missing/invalid) even after refresh req was sent
                    get().resetUser();
                }
            },
            logout: async () => {
                try {
                    await logoutUser();
                } catch (err) {
                    console.log(err);
                } finally {
                    get().resetUser();
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
            updateUsername: async (username) => {
                if (get().authenticated) {
                    set((state) => ({ user: { ...state.user, username } }));
                    try {
                        await updateUserFields({ username });
                    } catch (err) {
                        console.error("Failed to sync username when updating to db");
                        if (err.status === 400) return err;
                    }
                }

            },
            updateEmail: async (newEmail, password) => {
                if (get().authenticated) {
                    set((state) => ({ user: { ...state.user, email: newEmail } }));
                    try {
                        await modifyEmail({ newEmail, password });
                    } catch (err) {
                        console.error("Failed to sync email when updating to db");
                        if (err.status === 400) return err;
                    }
                }

            },
            updatePassword: async (oldPassword, newPassword) => {
                if (get().authenticated) {
                    try {
                        await modifyPassword({ oldPassword, newPassword });
                    } catch (err) {
                        console.error("Failed to update password.");
                        if (err.status === 400) return err;
                    }
                }

            },
            addToPokedex: (shiny, time_added) => {
                const { pokedex, updateShinyStatus } = get();
                const { answer } = useGameStore.getState();
                const isShiny = shiny || (Math.floor(Math.random() * 4096) + 1) === 4096;
                const foundPokemon = pokedex.find(p => {
                    if (p.id === answer._id) {
                        if(isShiny && p.isShiny !== true) updateShinyStatus(answer);
                        return true;
                    }
                });
                if (!foundPokemon) {
                    set((state) => ({ pokedex: [...state.pokedex, { id: answer._id, isShiny, time_added: time_added || Date.now() }]}));
                    
                }
            },
            updateShinyStatus: (answer) => set((state) => ({
                pokedex: state.pokedex.map(p => {
                    if (p.id === answer._id && p.isShiny !== true) {
                        return {...p, isShiny: true};
                    }
                    return p;
                })
            })),
            incrementGuessCount: () => set((state) => ({
                user: {...state.user, totalGuesses: state.user.totalGuesses + 1 }
            })),
            incrementGamesPlayed: () => set((state) => ({
                user: {...state.user, gamesPlayed: state.user.gamesPlayed + 1 }
            })),
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
            },
            // Delete account
            deleteAccount: async () => {
                const { authenticated } = get();
                set({ user: null, authenticated: false, settings: { ...defaultSettings }, pokedex: [] });
                // If user was authenticated, handle deleting the account and cascade delete refresh tokens, auth, user, and games
                if (authenticated) {
                    try {
                        await deleteUser();
                    } catch (err) {
                        console.error("Error deleting account", err);
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