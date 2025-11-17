import { filterBody } from "../utils/funcs";


// POST /users
export function createUser(req, res, next) {
    try {
        
    } catch (err) {
        next(err);
    }
}

// GET /users/:id
export function getUser(req, res, next) {
    try {
        
    } catch (err) {
        
    }
}

// DELETE /users/:id
export function deleteUser(req, res, next) {
    
}

// PATCH /users/:id
export function updateUser(req, res, next) {
    const body = filterBody(["name", "username", "email", "profilePicImg"]);

}

// PATCH /users/:id/pokedex/add

// PATCH /users/:id/pokedex/remove