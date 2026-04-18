import { Request, Response, NextFunction } from "express";
import { isAllowedFile } from "../utils/file.util";
import Post from "../models/Post";
import { ROLE } from "../constants/role";

export const validateInputCreatePost = async (req: Request, res: Response, next: NextFunction) => {
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

export const validateInputUpdatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const loadPost = (paramName = "id") => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await Post.findById(req.params[paramName]);

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            (req as any).post = post;

            next();
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export const canEditAndUpdatePost = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const post = (req as any).post;

    if (post.userId.toString() !== user.userId) {
        return res.status(403).json({ message: "You do not have permission" });
    }

    next();
}

export const canDeletePost = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const post = (req as any).post;

    const isOwner = post.userId.toString() === user.userId;
    const isAdmin = user.role === ROLE.ADMIN;

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You do not have permission" });
    }

    next();
}