import { Request, Response, NextFunction } from "express";
import { ROLE } from "../constants/role";
import jwt from "jsonwebtoken";

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;
        if(!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        if(user.role !== ROLE.ADMIN) {
            return res.status(403).json({ message: "You do not have permission" });
        }

        next();
    } catch (error: any) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const validateInputSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, rememberMe } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if(!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (typeof rememberMe !== "undefined" && typeof rememberMe !== "boolean") {
            return res.status(400).json({ message: "rememberMe must be a boolean" })
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const validateInputSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, fullname, phone } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if(!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if(!fullname) {
            return res.status(400).json({ message: "Full name is required" });
        }

        if(!phone) {
            return res.status(400).json({ message: "Phone is required" });
        }

        if (!/^\d+$/.test(phone)) {
            return res.status(400).json({ message: "Phone must contain only numbers" });
        }

        if (phone.length < 10) {
            return res.status(400).json({ message: "Phone must be at least 10 digitss" });
        }

        if (phone.length > 11) {
            return res.status(400).json({ message: "Phone must not exceed 11 digits" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const validateInputForgotPasswordSendCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const validateInputVerifyForgotPasswordCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!code) {
            return res.status(400).json({ message: "Code is required" });
        }

        if (!/^\d{6}$/.test(code.trim())) {
            return res.status(400).json({ message: "Code must be 6 digits" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const validateInputResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code, newPassword, confirmPassword } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!confirmPassword) {
            return res.status(400).json({ message: "Confirm password is required" });
        }

        if (confirmPassword !== newPassword) {
            return res.status(400).json({ message: "Confirm password does not match" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}