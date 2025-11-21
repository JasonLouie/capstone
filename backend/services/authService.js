import EndpointError from "../classes/EndpointError.js";
import Auth from "../models/authModel.js";

export async function createNewAuth(body) {
    const { email, password } = body;
    const auth = await Auth.create({email, password});
    return auth;
}

export async function getAuthById(id) {
    const user = await Auth.findById(id);
    if (!user) throw new EndpointError(404, "User");
    return user;
}

export async function getAuthByEmail(email) {
    const user = await Auth.findOne({ email });
    if (!user) throw new EndpointError(404, "User");
    return user;
}

// Middleware validates the password before reaching this step. Hashing is accomplished in the save hook.
export async function modifyPassword(userId, body) {
    const user = await getAuthById(userId);
    const { oldPassword, newPassword } = body;

    const correct = await user.comparePassword(oldPassword);
    if(!correct) throw new EndpointError(401, "Invalid password.");

    const same = await user.comparePassword(newPassword);
    if (same) throw new EndpointError(400, "New password cannot be the same as old password.");
    user.password = newPassword;
    await user.save();
}

// Middleware validates the email before reaching this step.
export async function modifyEmail(userId, body) {
    const user = await getAuthById(userId);
    const { password, newEmail } = body;

    const correct = await user.comparePassword(password);
    if(!correct) throw new EndpointError(401, "Invalid password.");
    
    const emailTaken = await getAuthByEmail(newEmail);
    if (emailTaken) throw new EndpointError(400, "Email is taken.");
    user.email = newEmail;
    await user.save();
}