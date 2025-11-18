import * as userService from "../services/userService.js";
import * as tokenService from "../services/tokenService.js";

// GET /users
export async function login(req, res, next) {
    try {
        const tokens = await tokenService.createNewTokens(req.user._id);
        res.json(tokens);
    } catch (err) {
        next(err);
    }
}

// POST /users
export async function signup(req, res, next) {
    try {
        const user = await userService.createNewUser(req.body);
        const tokens = await tokenService.createNewTokens(user._id);
        res.json(tokens);
    } catch (err) {
        next(err);
    }
}

// POST /users/logout
export async function logout(req, res, next) {
    try {
        const message = await tokenService.removeRefreshToken(req.body.refreshToken, req.user._id);
        res.json(message);
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
        const { _id, name, username, email, profilePicUrl } = req.user;
        res.json({ _id, name, username, email, profilePicUrl });
    } catch(err) {
        next(err);
    }
}

// DELETE /users
export async function removeUser(req, res, next) {
    try {
        await userService.deleteUser(req.user._id);
        await tokenService.deleteAllUserTokens(req.user._id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users - For non-sensitive fields (not password)
export async function updateUser(req, res, next) {
    try {
        await userService.modifyUser(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATH /users/reset-password
export async function resetPassword(req, res, next) {
    try {
        await userService.modifyPassword(req.user._id, req.body.password);
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
}

// GET /users/pokedex
export async function getPokedex(req, res, next) {
    try {
        const pokedex = await userService.getPokedexByUserId(req.user._id);
        res.json(pokedex);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/pokedex
export async function addPokedexEntry(req, res, next) {
    try {
        const pokedex = await userService.addToPokedex(req.user._id, req.body);
        res.status(204).json(pokedex);
    } catch (err) {
        next(err);
    }
}

// DELETE /users/pokedex
export async function resetPokedex(req, res, next) {
    try {
        const pokedex = await userService.deletePokedex(req.user._id);
        res.status(204).json(pokedex);
    } catch(err) {
        next(err);
    }
}