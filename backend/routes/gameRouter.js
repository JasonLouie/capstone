import express from "express";
import * as gameController from "../controllers/gameController.js";
import { protect } from "../middleware/userAuth.js";
import { validateBasicGameSettings, validatePokemon } from "../middleware/validators.js";

const router = express.Router();

router.patch("/game-settings", protect, validateBasicGameSettings, gameController.updateGameSettings);
router.route("/pokedex")
    .patch(protect, validatePokemon, gameController.addPokedexEntry)
    .delete(protect, gameController.resetPokedex);

export default router;