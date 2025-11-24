import * as gameService from "../services/gameService.js";
import { addToPokedex, incrementTotalGuesses } from "../services/userService.js";

// POST /game/me
export async function getOrResumeGameData(req, res, next) {
    try {
        const game = await gameService.getOrResumeGame(req.user._id, req.body.settings);
        const { gameState, guesses, mode, answer, version, settings } = game;
        res.json({ gameState, guesses, mode, answer, version, settings });
    } catch(err) {
        next(err);
    }
}

// POST /game/me/new
export async function createGame(req, res, next) {
    try {
        const game = await gameService.createNewGame(req.user._id, req.body.settings, req.body.answer);
        const { gameState, guesses, mode, answer, version, settings } = game;
        res.json({ gameState, guesses, mode, answer, version, settings });
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
        const game = await gameService.modifyGame(req.user._id, req.body);
        const entry = await addToPokedex(req.user._id, game.answer);
        console.log(entry);
        res.status(201).json(entry);
    } catch(err) {
        next(err);
    }
}