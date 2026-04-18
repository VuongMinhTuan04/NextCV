import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const validateInputComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body;

        if(!content) {
            throw new Error("Vui lòng nhập bình luận");
        }

        if(content.trim().length > 255) {
            return res.status(400).json({ message: "Bình luận không được vượt quá 255 ký tự" });
        }
        
        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const loadComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        (req as any).comment = comment;

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const canUpdateComment = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const comment = (req as any).comment;

    if (comment.userId.toString() !== user.userId) {
        return res.status(403).json({ message: "You do not have permission" });
    }

    next();
}

export const canDeleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const comment = (req as any).comment;

        const isOwner = comment.userId.toString() === user.userId;

        const post = await Post.findById(comment.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isPostOwner = post.userId.toString() === user.userId;

        if (!isOwner && !isPostOwner) {
            return res.status(403).json({ message: "You do not have permission" });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}