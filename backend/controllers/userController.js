import * as userService from "../services/userService.js";

// GET /users/me
export async function getUser(req, res, next) {
    try {
        const userDoc = await userService.getUserById(req.user._id);
        const { _id, username, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings } = userDoc;
        res.json({ username, email: _id.email, profilePicUrl, gamesPlayed, totalGuesses, pokedex, settings });
    } catch (err) {
        next(err);
    }
}

// PATCH /users/me - Only modify username or profile pic
export async function updateUser(req, res, next) {
    try {
        await userService.modifyUser(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/me/settings
export async function updateBasicSettings(req, res, next) {
    try {
        await userService.modifySettings(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// POST /users/me/settings/generations/add
export async function addGeneration(req, res, next) {
    try {
        await userService.addToGenerations(req.user._id, req.body.generation);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// DELETE /users/me/settings/generations/:generation
export async function removeGeneration(req, res, next) {
    try {
        await userService.deleteFromGenerations(req.user._id, req.params.generation);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// DELETE /users/me/pokedex
export async function resetPokedex(req, res, next) {
    try {
        await userService.resetUserPokedex(req.user._id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}
