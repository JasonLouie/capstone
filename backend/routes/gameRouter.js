import express from "express";
import * as gameController from "../controllers/gameController.js";
import { validateNewPokemon, validateUpdateGame } from "../middleware/validators.js";

const router = express.Router();

router.route("/me")
    .get(gameController.getGameInfo)
    .put(validateUpdateGame, gameController.updateGame);

router.put("/me/answer", validateNewPokemon, gameController.updateAnswer);
router.put("/me/guess", validateNewPokemon, gameController.addGuess);

export default router;