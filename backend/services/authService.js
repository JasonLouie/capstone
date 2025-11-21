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
export async function modifyPassword(auth, body) {
    if (auth.version != body.version) throw new EndpointError(409, "Request's version field is behind. Changes will be ignored.");
    auth.password = body.password;
    await req.user.save();
}