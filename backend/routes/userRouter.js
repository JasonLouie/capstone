import express from "express";
import * as userController from "../controllers/userController.js";
import {validateSignUp, validateModifyUser, validateLogin, validatePassword } from "../middleware/validators.js";
import { authenticateUser as authenticate, protect } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/")
    .get(protect, userController.getUser)
    .patch(protect, validateModifyUser, userController.updateUser)
    .delete(protect, userController.removeUser);

router.post("/signup", validateSignUp, userController.signup);
router.post("/login", validateLogin, authenticate, userController.login);
router.post("/logout", protect, userController.logout);

router.post("/refresh", userController.generateTokens);

router.patch("/reset-password", protect, validatePassword, userController.resetPassword);

export default router;