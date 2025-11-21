import EndpointError from "../classes/EndpointError";
import Game from "../models/gameModel";

// Note: Middleware will validate the fields in the body before reaching this step.
export async function modifyGameSettings(userId, body) {
    const game = await Game.findById(userId);
    if (!game) throw new EndpointError(404, "Game");
    const { mode = "", all = null } = body;
    if (mode) game.settings.mode = mode;
    if (all !== null) game.settings.all = all;
    await game.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addGeneration(userId, generation) {
    const game = await Game.findById(userId);
    if (!game) throw new EndpointError(404, "Game");
    if (game.settings.generations.includes(generation)) {
        throw new EndpointError(409, "Generation is already in the user's game setting.");
    }
    game.settings.generations.push(generation);
    await user.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function removeGeneration(userId, generation) {
    const game = await Game.findById(userId);
    if (!game) throw new EndpointError(404, "Game");
    if (!game.settings.generations.includes(generation)) return; // The generation is already gone. No error.
    
    game.settings.generations.find((g, i) => {
        if (g === generation) {
            game.settings.generations.splice(i, 1);
            return true;
        }
    });
    await game.save();
}

// Note: Middleware will validate the fields in the body before reaching this step.
export async function addToPokedex(userId, body) {
    const game = await Game.findById(userId);
    if (!game) throw new EndpointError(404, "Game");

    const { name, imgUrl, isShiny = false } = body;
    if (game.pokedex.includes(name)) {
        throw new EndpointError(409, "Pokemon is already in the user's pokedex.");
    }
    game.pokedex.push({ name, imgUrl, isShiny });
    await game.save();
}

export async function resetUserPokedex(userId) {
    const game = await Game.findByIdAndUpdate(userId, {pokedex: []});
    if (!game) throw new EndpointError(404, "Game");
    return game;
}