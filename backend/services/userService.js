import User from "../models/userModel.js";
import EndpointError from "../classes/EndpointError.js";
import { filterBody } from "../utils/utils.js";

const updateOptions = { runValidators: true, new: true };

export async function createNewUser(body) {
    const filteredBody = filterBody(["username", "email", "password", "profilePicUrl"], body);
    const user = await User.create(filteredBody);
    return user;
}

export async function getUserById(id) {
    const user = await User.findById(id);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

export async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    if (!user) throw new EndpointError(404, "User");
    return user;
}

export async function deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyUser(id, body) {
    const filteredBody = filterBody(["username", "email", "profilePicUrl"], body);
    const user = User.findByIdAndUpdate(id, filteredBody, updateOptions);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

export async function modifyPassword(id, password) {
    const user = await User.findById(id);
    if (!user) throw new EndpointError(404, "User");
    user.password = password
    user.save();
    return user;
}

export async function getPokedexByUserId(id) {
    const user = await User.findById(id);
    if (!user) throw new EndpointError(404, "User");
    return {pokedex: user.pokedex};
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addToPokedex(id, pokemon) {
    const user = await User.findByIdAndUpdate(id, { $addToSet: { pokedex: pokemon } }, updateOptions);
    if (!user) throw new EndpointError(404, "User");
    return {pokedex: user.pokedex};
}

export async function deletePokedex(id) {
    const user = await User.findByIdAndUpdate(id, { pokedex: [] }, updateOptions);
    if (!user) throw new EndpointError(404, "User");
    return {pokedex: user.pokedex};
}