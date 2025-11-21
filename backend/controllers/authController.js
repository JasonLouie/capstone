import * as authService from "../services/authService.js";
import { createNewGame, deleteGames, getGame } from "../services/gameService.js";
import * as tokenService from "../services/tokenService.js";
import { createNewUser, getUserById } from "../services/userService.js";

// Shared function that handles sending cookies, user, and game data upon logging in, signing in, or refreshing token
function sendCookiesAndData(userDoc, gameDoc, tokens, res) {
    const { accessToken, refreshToken } = tokens;
    const { username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings } = userDoc;
    const { state, version } = gameDoc;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60 * 1000 // 30m
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 3600 * 1000, // 7d
        path: "/api/auth/refresh"
    });

    res.json({ user: { username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings }, game: { state, version } });
}

// POST /auth/login
export async function login(req, res, next) {
    try {
        const [userDoc, gameDoc, tokens] = await Promise.all([getUserById(req.user._id), getGame(req.user._id), tokenService.createNewTokens(req.user._id)]);
        sendCookiesAndData(userDoc, gameDoc, tokens, res);
    } catch (err) {
        next(err);
    }
}

// POST /auth/signup
export async function signup(req, res, next) {
    try {
        const auth = await authService.createNewAuth(req.body);
        const [userDoc, gameDoc, tokens] = await Promise.all([createNewUser(auth._id, req.body), createNewGame(auth._id), tokenService.createNewTokens(auth._id)]);
        sendCookiesAndData(userDoc, gameDoc, tokens, res);
    } catch (err) {
        next(err);
    }
}

// POST /auth/logout
export async function logout(req, res, next) {
    try {
        await tokenService.removeRefreshToken(req.cookies);
        res.clearCookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh"
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// POST /auth/refresh
export async function generateTokens(req, res, next) {
    try {
        const { accessToken, refreshToken } = await tokenService.generateNewTokens(req.cookies);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 3600 * 1000,
            path: "/api/auth"
        });
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

        // Clear cookies
        res.clearCookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh"
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}