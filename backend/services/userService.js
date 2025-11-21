import User from "../models/userModel.js";
import EndpointError from "../classes/EndpointError.js";
import { filterBody } from "../utils/utils.js";

// Only used by auth route
export async function createNewUser(userId, body) {
    const filteredBody = filterBody(["username", "profilePicUrl"], body);
    const user = await User.create({ _id: userId, ...filteredBody });
    return user;
}

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

export async function deleteUser(userId) {
    await User.findByIdAndDelete(userId);
}

async function updateUser(_id, version, updates) {
    // Shallow copy so that the original update object isn't modified
    const finalUpdate = { ...updates };

    // If finalUpdate doesn't contain an inc field, initialize it
    if (!finalUpdate.$inc) finalUpdate.$inc = {};

    // Add the version increment
    finalUpdate.$inc.version = 1;

    const user = await User.findOneAndUpdate({ _id, version }, finalUpdate, { new: true, runValidators: true });

    if (!user) throw new EndpointError(400, "Version mismatch or user does not exist.");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyUser(userId, body) {
    const filteredBody = filterBody(["username", "profilePicUrl"], body);
    await updateUser(userId, body.version, { $set: filteredBody });
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyGameSettings(userId, body) {
    const query = {};
    if (body.mode) query["settings.mode"] = body.mode;
    if (body.all) query["settings.all"] = body.all;
    await updateUser(userId, body.version, { $set: query });

}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addGeneration(userId, generation) {
    await updateUser(userId, body.version, { $addToSet: { "settings.generations": generation } });
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function removeGeneration(userId, generation) {
    await updateUser(userId, body.version, { $pull: { "settings.generations": generation } });
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addToPokedex(userId, body) {
    const { id, name, img, types, isShiny = false } = body;
    await updateUser(userId, body.version, { $addToSet: { pokedex: { id, name, img, types, isShiny } } });
}

export async function resetUserPokedex(userId, body) {
    await updateUser(userId, body.version, { $set: { pokedex: [] } });
}