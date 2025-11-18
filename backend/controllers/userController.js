import * as userService from "../services/userService.js";

// GET /users
export async function login(req, res, next) {
    try {
        res.json(req.user);
    } catch (err) {
        next(err);
    }
}

// POST /users
export async function signup(req, res, next) {
    try {
        const user = await userService.createNewUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

// POST /users/logout

export async function logout(req, res, next) {
    try {
        
    } catch (err) {
        next(err);
    }
}

// DELETE /users/:id
export async function removeUser(req, res, next) {
    try {
        await userService.deleteUser(req.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/:id - For non-sensitive fields (not password)
export async function updateUser(req, res, next) {
    try {
        await userService.modifyUser(req.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PATH /users/:id/reset-password
export async function resetPassword(req, res, next) {
    try {
        await userService.modifyPassword(req,params.id, req.body.password);
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
}

// GET /users/:id/pokedex
export async function getPokedex(req, res, next) {
    try {
        const pokedex = await userService.pokedex(req.params.id);
        res.json(pokedex);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/:id/pokedex
export async function addPokedexEntry(req, res, next) {
    try {
        await userService.addToPokedex(req.params.id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// DELETE /users/:id/pokedex
export async function resetPokedex(req, res, next) {
    try {
        const user = await userService.deletePokedex(req.params.id);
        res.status(204).json(user);
    } catch(err) {
        next(err);
    }
}