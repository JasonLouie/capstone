import * as gameService from "../services/gameService.js";

// GET /game/me
export async function getGameInfo(req, res, next) {
    try {
        const { state } = await gameService.getGame(req.user._id);
        res.json(state);
    } catch(err) {
        next(err);
    }
}

// PUT /game/me/answer
export async function updateAnswer(req, res, next) {
    try {
        await gameService.modifyAnswer(req.user, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PUT /game/me/guess
export async function addGuess(req, res, next) {
    try {
        await gameService.addNewGuess(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// DELETE /game/me
export async function resetGame(req, res, next) {
    try {
        await gameService.resetGameState(req.user._id);
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
}