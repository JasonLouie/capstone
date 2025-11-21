import * as gameService from "../services/gameService.js";

// PATCH /users/game-settings
export async function updateGameSettings(req, res, next) {
    try {
        await gameService.modifyGameSettings(req.user, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/game-settings/add-generation
export async function addToGenerations(req, res, next) {
    try {
        await gameService.addGeneration(req.user, req.body.generation);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/game-settings/remove-generation
export async function deleteGenerations(req, res, next) {
    try {
        await gameService.removeGeneration(req.user, req.body.generation);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /games/pokedex
export async function addPokedexEntry(req, res, next) {
    try {
        await gameService.addToPokedex(req.user.pokedex, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// DELETE /games/pokedex
export async function resetPokedex(req, res, next) {
    try {
        await gameService.resetUserPokedex(req.user);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}