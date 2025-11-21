import EndpointError from "../classes/EndpointError.js";
import Game from "../models/gameModel.js";

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

export async function updateAnswer(userId, body) {
    const game = await getGame(userId, body.version);
    game.answer = body.answer;
    await game.save();
}

export async function addGuess(userId, body) {
    const game = await getGame(userId, body.version);
    game.state.guesses.push(body.pokemon);
    await game.save();
}

export async function resetGameState(userId) {
    const game = await getGame(userId, body.version);
    game.state = undefined; // Mongoose will revert the game back to its default state.
    await game.save();
}

export async function deleteGames(userId) {
    await Game.deleteMany({userId});
}