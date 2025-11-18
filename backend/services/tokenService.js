import EndpointError from "../classes/EndpointError.js";
import RefreshToken from "../models/refreshTokenModel.js";
import jwt from "jsonwebtoken";

export async function removeRefreshToken(refreshToken, requestingUserId) {
    if (!refreshToken) throw new EndpointError(400, "Refresh token is required.");

    // Middleware is supposed to provide a requestingUserId to this function. If it is a falsy value, a server error occurred.
    if (!requestingUserId) throw new EndpointError(500);

    let dbToken;
    try {
        dbToken = await RefreshToken.findOne({ token: refreshToken });
    } catch {
        throw new EndpointError(500); // Server error during logout.
    }

    // If the refresh token DNE, it is already invalid, so prompt the user to logout
    if (!dbToken) {
        console.log("Refresh token was already deleted. Logout success.");
        return { message: "Logged out successfully." };
    }

    // A user should never have access to another user's refresh token. This is a security breach.
    if (dbToken.userId.toString() !== requestingUserId.toString()) {
        console.warn(`User ${requestingUserId} attempted to log out with a token belonging to ${dbToken.user}.`);
        throw new EndpointError(403, "Forbidden action. Cannot logout with another user's token.");
    }

    await dbToken.deleteOne();
    return { message: "Logged out successfully" };
}

// Refreshes the user's access and generate new tokens
export async function generateNewTokens(refreshToken) {
    if (!refreshToken) throw new EndpointError(400, "Refresh token is required.");

    let dbToken;
    try {
        dbToken = await RefreshToken.findOne({ token: refreshToken });
    } catch {
        throw new EndpointError(500); // Server error during token refresh.
    }

    // If dbToken DNE, 403 Forbidden because an attempt is made to generate a new access token with an invalid refresh token
    if (!dbToken) {
        console.log("Invalid refresh token");
        throw new EndpointError(403, "Forbidden action. Invalid refresh token.");
    }

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        console.error("Expired or invalid token");
        throw new EndpointError(403, "Forbidden action. Refresh token is expired or invalid.");
    }

    // A user should never have access to another user's refresh token.
    if (dbToken.userId.toString() !== payload.sub) {
        console.warn(`User ${payload.sub} attempted to generate new tokens using a refresh token belonging to ${dbToken.user}.`);
        throw new EndpointError(403, "Forbidden action. Cannot generate new tokens with another user's token.");
    }

    const [tokens, resultRemove] = await Promise.all([createNewTokens(payload.sub), dbToken.deleteOne()]);
    return tokens;
}

export async function createNewTokens(sub) {
    const payload = { sub };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    await RefreshToken.create({ token: refreshToken, userId: sub });
    return { token: accessToken, refreshToken };
}

export async function deleteAllUserTokens(id) {
    const resultRemove = await RefreshToken.deleteMany({ userId: id });
    return resultRemove;
}