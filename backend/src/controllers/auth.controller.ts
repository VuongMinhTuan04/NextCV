import { Request, Response } from "express";
import {
    resetForgotPasswordService,
    sendForgotPasswordCodeService,
    signInService,
    signOutService,
    signUpService,
    verifyForgotPasswordCodeService
} from "../services/auth.service";

const REMEMBER_ME_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const signInController = async (req: Request, res: Response) => {
    try {
        const { user, token, rememberMe } = await signInService(req.body);

        res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            ...(rememberMe ? { maxAge: REMEMBER_ME_MAX_AGE } : {}),
        });

        const { password, ...infoUser } = user.toObject();

        res.status(200).json({ message: "Sign In Success", data: infoUser });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const signUpController = async (req: Request, res: Response) => {
    try {
        const user = await signUpService(req.body);
        const { password, ...infoUser } = user.toObject();

        res.status(201).json({ message: "[GET]: Sign Up Success", data: infoUser });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const signOutController = async (req: Request, res: Response) => {
    try {
        await signOutService();

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        res.status(200).json({ message: "[GET]: Sign Out Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const sendForgotPasswordCodeController = async (req: Request, res: Response) => {
    try {
        await sendForgotPasswordCodeService(req.body);

        res.status(200).json({ message: "[POST]: Send Reset Code Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const verifyForgotPasswordCodeController = async (req: Request, res: Response) => {
    try {
        await verifyForgotPasswordCodeService(req.body);

        res.status(200).json({ message: "Verification code is valid" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const resetForgotPasswordController = async (req: Request, res: Response) => {
    try {
        await resetForgotPasswordService(req.body);

        res.status(200).json({ message: "[PATCH]: Reset Password Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}