import express from "express";
import * as userController from "../controllers/userController.js";
import { validateBasicGameSettings, validateGeneration, validateModifyUser, validatePokedexEntry } from "../middleware/validators.js";

const router = express.Router();

router.route("/me")
    .get(userController.getUser)
    .patch(validateModifyUser, userController.updateUser)

router.route("/me/settings")
    .get(userController.getUserSettings)
    .patch(validateBasicGameSettings, userController.updateBasicSettings);

router.post("/me/settings/generations/add", validateGeneration, userController.addGeneration);
router.post("/me/settings/generations/:generation", userController.removeGeneration);

router.route("/me/pokedex")
    .get(userController.getUserPokedex)
    .post(validatePokedexEntry, userController.addPokedexEntry)
    .delete(userController.resetPokedex);

export default router;