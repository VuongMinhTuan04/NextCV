import { Request, Response, NextFunction } from "express";
import { isAllowedFile } from "../utils/file.util";

export const validateInputPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        const file = req.file;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }

        if (!isAllowedFile(file.mimetype)) {
            return res.status(400).json({ message: "File type is not allowed" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}