import { Request, Response } from "express";
import { getAllPostService } from "../services/post.service";

export const getAllPostController = async (req: Request, res: Response) => {
    try {
        const post = await getAllPostService();

        res.status(200).json({ message: "[SUCCESS]: Get All Post Success", data: post });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const createPostController = async (req: Request, res: Response) => {
    try {
        const post = await getAllPostService();

        res.status(200).json({ message: "[SUCCESS]: Get All Post Success", data: post });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const updatePostController = async (req: Request, res: Response) => {
    try {
        const post = await getAllPostService();

        res.status(200).json({ message: "[SUCCESS]: Get All Post Success", data: post });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const post = await getAllPostService();

        res.status(200).json({ message: "[SUCCESS]: Get All Post Success", data: post });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}