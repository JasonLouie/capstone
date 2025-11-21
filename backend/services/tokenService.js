import EndpointError from "../classes/EndpointError.js";
import RefreshToken from "../models/refreshTokenModel.js";
import jwt from "jsonwebtoken";

// Handles removing refresh token when user is logged out
export async function removeRefreshToken(cookie) {
    if (!cookie?.refreshToken) return; // User is already logged out since there is no cookie.
    const refreshToken = cookie.refreshToken;

    let dbToken;
    try {
        dbToken = await RefreshToken.findOne({ refreshToken });
    } catch {
        throw new EndpointError(500); // Server error during logout.
    }

    // If the refresh token DNE, it is already invalid, so prompt the user to logout
    if (!dbToken) {
        console.log("Refresh token was already deleted. Logout success.");
        return;
    }
    await dbToken.deleteOne();
}

// Refreshes the user's access and generate new tokens
export async function generateNewTokens(cookie) {
    if (!cookie?.refreshToken) throw new EndpointError(400, "Refresh token is required.");

    const refreshToken = cookie.refreshToken;

    let dbToken;
    try {
        dbToken = await RefreshToken.findOne({ refreshToken });
    } catch {
        throw new EndpointError(500); // Server error during token refresh.
    }

    // If dbToken DNE, 403 Forbidden because an attempt is made to generate a new access token with an invalid refresh token
    if (!dbToken) {
        throw new EndpointError(403, "Forbidden action. Invalid refresh token.");
    }

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new EndpointError(403, "Forbidden action. Refresh token is expired or invalid.");
    }

    // A user should never have access to another user's refresh token.
    if (dbToken.userId.toString() !== payload.sub) {
        console.warn(`[WARNING]: User ${payload.sub} attempted to generate new tokens using a refresh token belonging to ${dbToken.user}.`);
        throw new EndpointError(403, "Forbidden action. Cannot generate new tokens with another user's token.");
    }

    const [tokens, resultRemove] = await Promise.all([createNewTokens(payload.sub), dbToken.deleteOne()]);
    console.log(payload.sub);
    return {tokens, userId: payload.sub};
}

export async function createNewTokens(sub) {
    const payload = { sub };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    await RefreshToken.create({ refreshToken, userId: sub });
    return { accessToken, refreshToken };
}

export async function deleteAllUserTokens(id) {
    const resultRemove = await RefreshToken.deleteMany({ userId: id });
    return resultRemove;
}