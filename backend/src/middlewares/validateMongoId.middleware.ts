import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (param: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[param] as string)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        next();
    };
};