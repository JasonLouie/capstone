import User from "../models/userModel.js";
import EndpointError from "../classes/EndpointError.js";
import { filterObject } from "../utils/utils.js";

// Only used by auth route
export async function createNewUser(userId, body) {
    const filteredBody = filterObject(["username", "profilePicUrl"], body);
    const user = await User.create({ _id: userId, ...filteredBody });
    return user;
}

// Only used by auth route
export async function deleteUser(userId) {
    await User.findByIdAndDelete(userId);
}

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyUser(userId, body) {
    const user = await getUserById(userId);
    const { username = null, profilePicUrl = null} = body;
    if (username) user.username = username;
    if (profilePicUrl) user.profilePicUrl = profilePicUrl;
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifySettings(userId, body) {
    const user = await getUserById(userId);
    const { mode = "", allGenerations = null } = body;
    if (mode) user.settings.mode = mode;
    if (allGenerations !== null) user.settings.allGenerations = allGenerations;
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addToGenerations(userId, generation) {
    const user = await getUserById(userId);
    if (user.settings.generations.includes(generation)) {
        throw new EndpointError(409, "Generation is already in the user's user setting.");
    }
    user.settings.generations.push(generation);
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function deleteFromGenerations(userId, generation) {
    const user = await getUserById(userId);
    if (!user.settings.generations.includes(generation)) return; // The generation is already gone. No error.

    user.settings.generations.find((g, i) => {
        if (g === generation) {
            user.settings.generations.splice(i, 1);
            return true;
        }
    });
    await user.save();
}

export async function resetUserPokedex(userId) {
    const user = await getUserById(userId);
    user.pokedex = []; // Set this back to the default value
    await user.save();
}

// Used by game to add to pokedex
export async function addToPokedex(userId, answer) {
    const user = await getUserById(userId);
    const isShiny = (Math.floor(Math.random() * 4096) + 1) === 4096;
    const foundPokemon = user.pokedex.find((p, i) => {
        if (p.id === answer) {
            if (isShiny && p.isShiny !== true) p[i].isShiny = true;
            return true;
        }
    });
    if (!foundPokemon) {
        user.pokedex.push({ id: answer, isShiny });
    }
    await user.save();
    return user.pokedex.find(p => p.id === answer);
}