import * as userService from "../services/userService.js";

// GET /users/me
export async function getUser(req, res, next) {
    try {
        
    } catch (err) {
        next(err);
    }
}

// PATCH /users/me - For non-sensitive fields (not password)
export async function updateUser(req, res, next) {
    try {
        await userService.modifyUser(req.user._id, req.body);
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