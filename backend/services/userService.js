import User from "../models/userModel.js";
import EndpointError from "../classes/EndpointError.js";

const updateOptions = { runValidators: true, new: true };

export const getUserById = async(id) => {
    const user = await User.findById(id);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

export const createNewUser = async(body) => await User.create(body);

export const deleteUser = async(id) => await User.findByIdAndDelete(id);

// Note: Middleware will validate the fields in the body before reaching this step. Assume that the body is valid and at least one field is updated.
export const modifyUser = async(id, body) => await User.findByIdAndUpdate(id, body, updateOptions);

// Note: Middleware will validate the fields in the body before reaching this step.
export const addToPokedex = async(id, pokemon) => await User.findById(id, { $addToSet: { pokedex: pokemon}}, updateOptions);

// Note: Middleware will validate the fields in the body before reaching this step.
export const removeFromPokedex = async(id, pokemon) => await User.findById(id, { $pull: { pokedex: pokemon}}, updateOptions);