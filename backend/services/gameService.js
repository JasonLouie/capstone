import EndpointError from "../classes/EndpointError.js";
import Game from "../models/gameModel.js";

export async function createNewGame(userId) {
    const game = await Game.create({ userId });
    return game;
}

export async function getOrCreateGame(userId, mode) {
    const game = await Game.findOneAndUpdate({ userId, gameState: "playing", mode }, { mode }, { new: true, upsert: true });
    if (!game) new EndpointError(404, "Game");
    return game;
}

async function updateGame(userId, version, updates) {
    // Shallow copy so that the original update object isn't modified
    const finalUpdate = { ...updates };

    // If finalUpdate doesn't contain an inc field, initialize it
    if (!finalUpdate.$inc) finalUpdate.$inc = {};

    // Add the version increment
    finalUpdate.$inc.version = 1;

    const gameDoc = await Game.findOneAndUpdate({ userId, version, gameState: "playing" }, finalUpdate, { new: true, runValidators: true });

    if (!gameDoc) throw new EndpointError(400, "Version mismatch or game does not exist.");
    return gameDoc;
}

export async function modifyAnswer(userId, body) {
    const { version, answer } = body;
    await updateGame(userId, version, { $set: { answer, guesses: [] } });
}

export async function addNewGuess(userId, body) {
    const { version, guess } = body;
    await updateGame(userId, version, { $addToSet: { guesses: guess } });
}

// Runs when user gives up or wins the game
export async function modifyGame(userId, body) {
    const { version, guess, gameState } = body;
    await updateGame(userId, version, { $set: { gameState }});
}

// Used by auth to remove all game history of the user
export async function deleteGames(userId) {
    await Game.deleteMany({ userId });
}