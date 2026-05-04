import { Request, Response } from "express";
import {
    createPostService,
    deletePostService,
    getAllPostService,
    likePostService,
    updatePostService
} from "../services/post.service";

export const getAllPostController = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const userId = req.query.userId ? String(req.query.userId) : undefined;

        const posts = await getAllPostService(page, limit, userId);

        res.status(200).json({ message: "[GET]: Get All Post Success", data: posts });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const createPostController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const file = req.file as Express.Multer.File;

        const post = await createPostService(req.body, file, user.userId);

        res.status(201).json({ message: "[POST]: Create Post Success", data: post });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const likePostController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const post = (req as any).post;

        const result = await likePostService(post, user.userId);

        res.status(200).json({
            message: "[PATCH]: Like Post Success",
            liked: result.liked,
            likesCount: result.likesCount
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const updatePostController = async (req: Request, res: Response) => {
    try {
        const post = (req as any).post;

        const updatedPost = await updatePostService(req.body, post);

        res.status(200).json({ message: "[PATCH]: Update Post Success", data: updatedPost });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const post = (req as any).post;

        await deletePostService(post);

        res.status(200).json({ message: "[DELETE]: Delete Post Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}