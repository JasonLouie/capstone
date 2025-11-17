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
export async function signUp(req, res, next) {
    try {
        const user = await userService.createNewUser(req.body);
        res.status(201).json(user);
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
        const user = await userService.modifyUser(req.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

// PATCH /users/:id/pokedex/add
export async function addPokedexEntry(req, res, next) {

}

// PATCH /users/:id/pokedex/remove
export async function removePokedexEntry(req, res, next) {

}