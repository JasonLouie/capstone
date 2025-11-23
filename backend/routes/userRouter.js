import express from "express";
import * as userController from "../controllers/userController.js";
import { validateBasicGameSettings, validateGeneration, validateModifyUser, validatePokedexEntry } from "../middleware/validators.js";

const router = express.Router();

router.route("/me")
    .get(userController.getUser)
    .patch(validateModifyUser, userController.updateUser)

router.patch("/me/settings", validateBasicGameSettings, userController.updateBasicSettings);

router.post("/me/settings/generations/add", validateGeneration, userController.addGeneration);
router.delete("/me/settings/generations/:generation", userController.removeGeneration);

router.delete("/me/pokedex", userController.resetPokedex);

export default router;