import express from "express";
import * as pokemonController from "../controllers/pokemonController.js";
import { validatePokemon } from "../middleware/validators.js";

const router = express.Router();
router.route("/")
    .get(pokemonController.getPokemon)
    .post(validatePokemon, pokemonController.addPokemon);

export default router;