import User from "../models/userModel.js";
import EndpointError from "../classes/EndpointError.js";
import { filterBody } from "../utils/funcs.js";

const updateOptions = { runValidators: true, new: true };

export const createNewUser = async(body) => {
    const filteredBody = filterBody(["name", "username", "email", "password", "profilePicUrl"], body);
    const user = await User.create(filteredBody);
    return user;
}

export const deleteUser = async(id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export const modifyUser = async(id, body) => {
    const filteredBody = filterBody(["name", "username", "email", "profilePicUrl"], body);
    const user = User.findByIdAndUpdate(id, filteredBody, updateOptions);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Note: Middleware will validate the fields in the body before reaching this step.
export const addToPokedex = async(id, pokemon) => await User.findById(id, { $addToSet: { pokedex: pokemon}}, updateOptions);

// Note: Middleware will validate the fields in the body before reaching this step.
export const removeFromPokedex = async(id, pokemonName) => await User.findById(id, { $pull: { pokedex: {name: pokemonName}}}, updateOptions);