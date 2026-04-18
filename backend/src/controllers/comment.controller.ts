import { Response, Request } from "express";
import {
    createCommentService,
    deleteCommentService,
    getAllCommentsByPostService,
    likeCommentService,
    updateCommentService
} from "../services/comment.service";

export const getAllCommentsByPostController = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;


        const comment = await getAllCommentsByPostService(postId, page, limit);

        res.status(200).json({ message: "[GET]: Get All Comment Success", data: comment });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const createCommentController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const post = (req as any).post;

        const comment = await createCommentService(req.body, user.userId, post);

        res.status(200).json({ message: "[POST]: Create Comment Success", data: comment });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const likeCommentController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const comment = (req as any).comment;

        const result = await likeCommentService(comment, user.userId);

        res.status(200).json({
            message: "[PATCH]: Like Comment Success",
            liked: result.liked,
            likesCount: result.likesCount
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCommentController = async (req: Request, res: Response) => {
    try {
        const comment = (req as any).comment;

        const updatedComment = await updateCommentService(req.body, comment);

        res.status(200).json({ message: "[PATCH]: Update Comment Success", data: updatedComment });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCommentController = async (req: Request, res: Response) => {
    try {
        const comment = (req as any).comment;

        await deleteCommentService(comment);

        res.status(200).json({ message: "[DELETE]: Delete Comment Success" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}