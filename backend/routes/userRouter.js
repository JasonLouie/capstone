import express from "express";
import * as userController from "../controllers/userController.js";
import { validateModifyUser, validatePassword } from "../middleware/validators.js";

const router = express.Router();

router.route("/")
    .get(userController.getUser)
    .patch(validateModifyUser, userController.updateUser)

router.patch("/reset-password", validatePassword, userController.resetPassword);

export default router;