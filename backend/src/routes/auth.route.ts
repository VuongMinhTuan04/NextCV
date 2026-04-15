import express from "express";
import {
    forgotPasswordController,
    signInController,
    signOutController,
    signUpController
} from "../controllers/auth.controller";
import { validateInputSignIn, validateInputSignUp } from "../middlewares/auth.middleware";

const router = express.Router(); 

router.post("/sign-in", validateInputSignIn, signInController);
router.post("/sign-up", validateInputSignUp, signUpController);
router.get("/sign-out", signOutController);
router.patch("/forgot-password", forgotPasswordController);

export default router;