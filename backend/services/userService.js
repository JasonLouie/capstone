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
    const user = await User.findById(userId).populate({path: "_id", select: "email"});
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyUser(userId, body) {
    const user = await getUserById(userId);
    ["username", "profilePicUrl"].forEach(key => { if (body[key]) user[key] = body[key] })
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

export async function getUserField(userId, field) {
    const user = await getUserById(userId);
    return user[field];
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addToPokedex(userId, body) {
    const user = await getUserById(userId);
    let img = body.img;
    const { id, name } = body;
    if (user.pokedex.find(p => p.name === name)) {
        throw new EndpointError(409, "Pokemon is already in the user's pokedex.");
    }
    const isShiny = (Math.floor(Math.random() * 4096) + 1) === 4096;
    if (isShiny) {
        img = img.replace(id, `shiny/${id}`);
    }
    user.pokedex.push({ id, name, img, isShiny });
    await user.save();
}

export async function resetUserPokedex(userId) {
    const user = await getUserById(userId);
    user.pokedex = undefined; // Set this back to the default value
    await user.save();
}