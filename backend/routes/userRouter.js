import express from "express";
import * as userController from "../controllers/userController.js";
import {validateSignUp, validateModifyUser, validateLogin} from "../middleware/validators.js";
import { authenticateUser as authenticate, protect } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/logout", protect, userController.logout);

router.route("/id")
    .get(validateLogin, authenticate, userController.login)
    .post(validateSignUp, userController.signup);

router.route("/:id")
    .patch(validateModifyUser, userController.updateUser)
    .delete(userController.removeUser);

router.route("/:id/pokedex")
    .get(userController.getPokedex)
    .patch(userController.addPokedexEntry)
    .delete(userController.resetPokedex)

export default router;