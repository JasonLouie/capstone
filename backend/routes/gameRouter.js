import express from "express";
import * as gameController from "../controllers/gameController.js";
import { validateGameMode, validateAnswer, validateGuess, validateUpdateGame } from "../middleware/validators.js";

const router = express.Router();

router.route("/me")
    .post(validateGameMode, gameController.getOrCreateGameData)
    .put(validateUpdateGame, gameController.updateGame);

router.put("/me/answer", validateAnswer, gameController.updateAnswer);
router.post("/me/guesses", validateGuess, gameController.addGuess);

export default router;