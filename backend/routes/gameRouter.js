import express from "express";
import * as gameController from "../controllers/gameController.js";
import { validateAnswer, validateGuess, validateUpdateGame, validateGameSettings, validateCreateNewGame } from "../middleware/validators.js";

const router = express.Router();

router.route("/me")
    .post(validateGameSettings, gameController.getOrResumeGameData)
    .put(validateUpdateGame, gameController.updateGame);

router.post("/me/new", validateCreateNewGame, gameController.createGame);

router.put("/me/answer", validateAnswer, gameController.updateAnswer);
router.post("/me/guesses", validateGuess, gameController.addGuess);

export default router;