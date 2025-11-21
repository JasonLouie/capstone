import * as userService from "../services/userService.js";
import * as tokenService from "../services/tokenService.js";

// GET /users
export async function login(req, res, next) {
    try {
        const { accessToken, refreshToken } = await tokenService.createNewTokens(req.user._id);

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
            path: "/api/users/refresh"
        });

        const { username, email, profilePicUrl, pokedex } = req.user;
        res.json({ username, email, profilePicUrl, pokedex });
    } catch (err) {
        next(err);
    }
}

// POST /users
export async function signup(req, res, next) {
    try {
        const user = await userService.createNewUser(req.body);
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
            path: "/api/users/refresh"
        });

        const { username, email, profilePicUrl, pokedex } = user;
        res.json({ username, email, profilePicUrl, pokedex });
    } catch (err) {
        next(err);
    }
}

// POST /users/logout
export async function logout(req, res, next) {
    try {
        await tokenService.removeRefreshToken(req.user._id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// POST /users/refresh-token
export async function generateTokens(req, res, next) {
    try {
        const tokens = await tokenService.generateNewTokens(req.body.refreshToken);
        res.json(tokens);
    } catch (err) {
        next(err);
    }
}

// GET /users
export async function getUser(req, res, next) {
    try {
        const { username, email, profilePicUrl, pokedex } = req.user;
        res.json({ username, email, profilePicUrl, pokedex });
    } catch (err) {
        next(err);
    }
}

// DELETE /users
export async function removeUser(req, res, next) {
    try {
        await req.user.deleteOne();
        await tokenService.deleteAllUserTokens(req.user._id);
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