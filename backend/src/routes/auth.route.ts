import express from "express";
import {
    resetForgotPasswordController,
    sendForgotPasswordCodeController,
    signInController,
    signOutController,
    signUpController,
    verifyForgotPasswordCodeController
} from "../controllers/auth.controller";
import {
    validateInputForgotPasswordSendCode,
    validateInputResetPassword,
    validateInputSignIn,
    validateInputSignUp,
    validateInputVerifyForgotPasswordCode
} from "../middlewares/auth.middleware";

const router = express.Router(); 

router.post("/sign-in", validateInputSignIn, signInController);

router.post("/sign-up", validateInputSignUp, signUpController);

router.post("/sign-out", signOutController);

router.post(
    "/forgot-password/send-code",
    validateInputForgotPasswordSendCode,
    sendForgotPasswordCodeController
);

router.post(
    "/forgot-password/verify-code",
    validateInputVerifyForgotPasswordCode,
    verifyForgotPasswordCodeController
);


router.patch(
    "/forgot-password/reset",
    validateInputResetPassword,
    resetForgotPasswordController
);

export default router;