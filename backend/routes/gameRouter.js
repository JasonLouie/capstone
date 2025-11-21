import express from "express";
import * as gameController from "../controllers/gameController.js";
import { validatePokemon } from "../middleware/validators.js";

const router = express.Router();

router.route("/me")
    .get(gameController.getGameInfo)
    .delete(gameController.resetGame);

router.put("/me/answer", validatePokemon, gameController.updateAnswer);
router.put("/me/guess", validatePokemon, gameController.addGuess);

export default router;