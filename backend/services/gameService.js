import EndpointError from "../classes/EndpointError.js";
import Game from "../models/gameModel.js";
import User from "../models/userModel.js";

export async function createNewGame(userId) {
    const game = await Game.create({ userId });
    return game;
}

export async function getGame(userId, version = null) {
    const game = await Game.findOne({ userId });
    if (!game) new EndpointError(404, "Game");
    if (version && game.version !== version) throw new EndpointError(409, "Request's version field is behind. Changes will be ignored.");
    return game;
}

export async function updateGame(_id, version, updates) {
    // Shallow copy so that the original update object isn't modified
    const finalUpdate = { ...updates };

    // If finalUpdate doesn't contain an inc field, initialize it
    if (!finalUpdate.$inc) finalUpdate.$inc = {};

    // Add the version increment
    finalUpdate.$inc.version = 1;

    const gameDoc = await Game.findOneAndUpdate({ _id, version }, finalUpdate, { new: true, runValidators: true });

    if (!gameDoc) throw new EndpointError(400, "Version mismatch or game does not exist.");
    
    // Handle updating the user stats
    const userUpdates = {};

    // Check if client added a guess to the guesses array (Increment total guesses by 1)
    if (finalUpdate.$addToSet && finalUpdate.$addToSet["state.guesses"]) {
        if (!userUpdates.$inc) userUpdates.$inc = {};
        userUpdates.$inc.totalGuesses = 1;
    }

    // Check for resetting game state (Increment games played by 1)
    const resetGameState = finalUpdate.$set && finalUpdate.$set["state"];
    if (resetGameState) {
        if (!userUpdates.$inc) userUpdates.$inc = {};
        userUpdates.$inc.gamesPlayed = 1;
    }

    if (userUpdates.$inc) {
        await User.findByIdAndUpdate(gameDoc.userId, userUpdates);
    }
    return gameDoc;
}

export async function updateAnswer(userId, body) {
    const { version, answer } = body;
    await updateGame(userId, version, { $set: answer });
}

export async function addGuess(userId, body) {
    const { version, guess } = body;
    await updateGame(userId, version, { $addToSet: { "state.guesses": guess } });
}

export async function resetGameState(userId) {
    const { version } = body;
    await updateGame(userId, version, { $set: { state: undefined } });
}

// Used by auth to remove all game history of the user
export async function deleteGames(userId) {
    await Game.deleteMany({userId});
}