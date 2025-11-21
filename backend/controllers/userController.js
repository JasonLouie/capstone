import * as userService from "../services/userService.js";
import * as tokenService from "../services/tokenService.js";
import { getGame } from "../services/gameService.js";

// GET /users
export async function login(req, res, next) {
    try {
        const { accessToken, refreshToken } = await tokenService.createNewTokens(req.user._id);

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
            path: "/api/users/refresh"
        });

        const game = await getGame(req.user._id);
        const { username, profilePicUrl, version } = req.user;
        const { _id, userId, createdAt, updatedAt, ...details } = game;
        res.json({ user: { username, email, profilePicUrl, version }, details });
    } catch (err) {
        next(err);
    }
}

// POST /users
export async function signup(req, res, next) {
    try {
        const [user, game] = await userService.createNewUser(req.body);
        const { accessToken, refreshToken } = await tokenService.createNewTokens(user._id);

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
            path: "/api/users"
        });

        const { username, profilePicUrl, version } = user;
        const { _id, userId, createdAt, updatedAt, ...details } = game;
        res.json({ user: { username, profilePicUrl, version }, details });
    } catch (err) {
        next(err);
    }
}

// POST /users/logout
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
            path: "/api/users/refresh"
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// POST /users/refresh
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
            path: "/api/users"
        });
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
}

// GET /users
export async function getUser(req, res, next) {
    try {
        const { username, profilePicUrl, version } = req.user;
        const { gamesPlayed, totalGuesses, pokedex } = await getGame(req.user._id);
        res.json({ user: { username, profilePicUrl, version }, game: { gamesPlayed, totalGuesses, pokedexLength: pokedex.length } });
    } catch (err) {
        next(err);
    }
}

// DELETE /users
export async function removeUser(req, res, next) {
    try {
        await req.user.deleteOne();
        await tokenService.deleteAllUserTokens(req.user._id);

        res.clearCookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/users/refresh"
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users - For non-sensitive fields (not password)
export async function updateUser(req, res, next) {
    try {
        await userService.modifyUser(req.user, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/reset-password
export async function resetPassword(req, res, next) {
    try {
        await userService.modifyPassword(req.user, req.body.password);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}