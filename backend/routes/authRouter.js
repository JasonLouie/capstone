import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateUser as authenticate, protect } from "../middleware/userAuth.js";
import { validateLogin, validateSignUp } from "../middleware/validators.js";

const router = express.Router();

router.post("/signup", validateSignUp, authController.signup);
router.post("/login", validateLogin, authenticate, authController.login);
router.post("/logout", protect, authController.logout);
router.post("/refresh", authController.generateTokens);
router.delete("/delete", protect, authController.removeUser);

export default router;