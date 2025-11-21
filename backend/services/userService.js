import User from "../models/userModel.js";
import EndpointError from "../classes/EndpointError.js";
import { filterBody } from "../utils/utils.js";
import { initGame } from "./gameService.js";

export async function createNewUser(body) {
    const filteredBody = filterBody(["username", "email", "password", "profilePicUrl"], body);
    const user = await User.create(filteredBody);
    const game = await initGame(user._id);
    return [user, game];
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



// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyUser(user, body) {
    const { username = "", email = "", profilePicUrl = "" } = body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePicUrl) user.profilePicUrl = profilePicUrl;
    await user.save();
}

// Middleware validates the password before reaching this step. Hashing is accomplished in the save hook.
export async function modifyPassword(user, password) {
    user.password = password;
    await req.user.save();
}