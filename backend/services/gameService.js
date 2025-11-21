import EndpointError from "../classes/EndpointError.js";
import Game from "../models/gameModel.js";
import User from "../models/userModel.js";

export async function createNewGame(userId) {
    const game = await Game.create({ userId });
    return game;
}

export async function getGame(userId) {
    const game = await Game.findOne({ userId });
    if (!game) new EndpointError(404, "Game");
    return game;
}

async function updateGame(_id, version, updates) {
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

        // Add to pokedex if the user's previous guess was correct
        if (gameDoc.guesses[0].id === gameDoc.answer.id) {
            if (!userUpdates.$addToSet) userUpdates.$addToSet = {};

            let img = gameDoc.guesses[0].img;
            const { id, name } = gameDoc.guesses[0];
            
            const isShiny = (Math.floor(Math.random() * 4096) + 1) === 4096;
            if (isShiny) {
                img = img.replace(id, `shiny/${id}`);
            }
            userUpdates.$addToSet = {pokedex: { id, name, img, isShiny} };
        }
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

export async function modifyAnswer(userId, body) {
    const { version, answer } = body;
    await updateGame(userId, version, { $set: answer });
}

export async function addNewGuess(userId, body) {
    const { version, guess } = body;
    await updateGame(userId, version, { $addToSet: { "state.guesses": guess } });
}

export async function resetGameState(userId) {
    await Game.findByIdAndUpdate(userId, { $set: { state: undefined } });
}

// Used by auth to remove all game history of the user
export async function deleteGames(userId) {
    await Game.deleteMany({ userId });
}