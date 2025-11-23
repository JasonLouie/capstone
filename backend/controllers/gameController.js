import * as gameService from "../services/gameService.js";
import { addToPokedex, incrementTotalGuesses } from "../services/userService.js";

// GET /game/me
export async function getOrCreateGameData(req, res, next) {
    try {
        const game = await gameService.getOrCreateGame(req.user._id, req.body.mode);
        const { gameState, guesses, mode, answer, version } = game;
        res.json({ gameState, guesses, mode, answer, version });
    } catch(err) {
        next(err);
    }
}

// PUT /game/me/answer
export async function updateAnswer(req, res, next) {
    try {
        await gameService.modifyAnswer(req.user._id, req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PUT /game/me/guess
export async function addGuess(req, res, next) {
    try {
        await gameService.addNewGuess(req.user._id, req.body);
        await incrementTotalGuesses(req.user._id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

// PUT /game/me (Handles winning/losing game)
export async function updateGame(req, res, next) {
    try {
        await gameService.modifyGame(req.user._id, req.body);
        await addToPokedex(req.user._id, req.body.answer);
        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
}