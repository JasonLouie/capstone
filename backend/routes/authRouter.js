import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateUser as authenticate, protect } from "../middleware/userAuth.js";
import { validateEmail, validateLogin, validatePassword, validateSignUp } from "../middleware/validators.js";

const router = express.Router();

router.post("/signup", validateSignUp, authController.signup);

router.post("/login", validateLogin, authenticate, authController.login);

router.post("/logout", protect, authController.logout);

router.post("/refresh", authController.generateTokens);

router.delete("/delete", protect, authController.removeUser);

router.post("/password", protect, validatePassword, authController.updatePassword);

router.post("/email", protect, validateEmail, authController.updateEmail);

export default router;