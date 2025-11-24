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

export async function getUserById(userId, populate=true) {
    let user = null;
    if (populate) user = await User.findById(userId).populate({path: "_id", select: "email"});
    else user = await User.findById(userId);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyUser(userId, body) {
    const user = await getUserById(userId, false);
    const { username = null, profilePicUrl = null} = body;
    if (username) user.username = username;
    if (profilePicUrl) user.profilePicUrl = profilePicUrl;
    console.log(user);
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifySettings(userId, body) {
    const user = await getUserById(userId, false);
    const { mode = "", allGenerations = null } = body;
    if (mode) user.settings.mode = mode;
    if (allGenerations !== null) user.settings.allGenerations = allGenerations;
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addToGenerations(userId, generation) {
    const user = await getUserById(userId, false);
    if (user.settings.generations.includes(generation)) {
        throw new EndpointError(409, "Generation is already in the user's user setting.");
    }
    user.settings.generations.push(generation);
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function deleteFromGenerations(userId, generation) {
    const user = await getUserById(userId, false);
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
    const user = await getUserById(userId, false);
    user.pokedex = undefined; // Set this back to the default value
    await user.save();
}
// Used by game to increment user's total guess count
export async function incrementTotalGuesses(userId) {
    const user = await getUserById(userId, false);
    user.totalGuesses++;
    await user.save();
}

// Used by game to add to pokedex
export async function addToPokedex(userId, answer) {
    const user = await getUserById(userId, false);
    const { id, name } = answer;
    const isShiny = (Math.floor(Math.random() * 4096) + 1) === 4096;
    const foundPokemon = user.pokedex.find((p, i) => {
        if (p.name === name && isShiny && p.isShiny !== true) {
            p[i].isShiny = true;
            return true;
        }
    });
    if (!foundPokemon) {
        user.pokedex.push({ id, name, img, isShiny });
    }
    await user.save();
}