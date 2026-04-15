import { Request, Response } from "express";
import { getAllPostService } from "../services/post.service";

export const getAllPostController = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const posts = await getAllPostService(page, limit);

        res.status(200).json({ message: "[GET]: Get All Post Success", data: posts });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const createPostController = async (req: Request, res: Response) => {
    try {
        

        res.status(200).json({ message: "[POST]: Create Post Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const updatePostController = async (req: Request, res: Response) => {
    try {
        

        res.status(200).json({ message: "[UPDATE]: Update Post Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const deletePostController = async (req: Request, res: Response) => {
    try {
        

        res.status(200).json({ message: "[DELETE]: Delete Post Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}