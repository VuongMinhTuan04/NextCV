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
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (email !== email.toLowerCase()) {
        return res.status(400).json({ message: "Email must be lowercase" });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if(!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    next();
}

export const validateInputSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullname, phone } = req.body;

    if(!email) {
        return res.status(400).json({ message: "Email is required" });
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
}

export const validateInputForgotPassword = async () => {
    
}