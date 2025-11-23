import * as authService from "../services/authService.js";
import * as tokenService from "../services/tokenService.js";
import { deleteGames } from "../services/gameService.js";
import { createNewUser, getUserById } from "../services/userService.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
};

const refreshTokenPath = "/api/auth";

// Shared function that handles sending cookies when user signs up, logs in, or refreshes tokens
function sendCookies(tokens, res) {
    const { accessToken, refreshToken } = tokens;

    // Access token expires after 30m 
    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 30 * 60 * 1000 });

    // Refresh token expires after 7d
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 3600 * 1000, path: refreshTokenPath });
}

function clearCookies(res) {
    res.clearCookie("accessToken", cookieOptions);

    res.clearCookie("refreshToken", { ...cookieOptions, path: refreshTokenPath });
}

// POST /auth/login
export async function login(req, res, next) {
    try {
        const [user, tokens] = await Promise.all([getUserById(req.user._id), tokenService.createNewTokens(req.user._id)]);
        sendCookies(tokens, res);
        const { username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings } = user;
        res.json({ username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings });
    } catch (err) {
        next(err);
    }
}

// POST /auth/signup
export async function signup(req, res, next) {
    let auth = null;
    try {
        auth = await authService.createNewAuth(req.body);
        const user = await createNewUser(auth._id, req.body);
        const tokens = await tokenService.createNewTokens(auth._id)
        sendCookies(tokens, res);
        const { username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings } = user;
        res.json({ username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings });
    } catch (err) {
        if (auth) await auth.deleteOne(); // Delete auth if user creation fails.
        next(err);
    }
}

// POST /auth/logout
export async function logout(req, res, next) {
    try {
        await tokenService.removeRefreshToken(req.cookies);
        clearCookies(res);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// POST /auth/refresh
export async function generateTokens(req, res, next) {
    try {
        console.log("Refreshing token...");
        const tokens = await tokenService.generateNewTokens(req.cookies);
        sendCookies(tokens, res);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PUT /auth/password
export async function updatePassword(req, res, next) {
    try {
        await authService.modifyPassword(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PUT /auth/email
export async function updateEmail(req, res, next) {
    try {
        await authService.modifyEmail(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// DELETE /auth/delete
export async function removeUser(req, res, next) {
    try {
        const userId = req.user._id;
        // Delete the auth entry, all refresh tokens, all games, and user info
        await Promise.all([req.user.deleteOne(), tokenService.deleteAllUserTokens(userId), deleteGames(userId), deleteUser(userId)]);
        clearCookies(res);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}