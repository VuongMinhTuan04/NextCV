import { IComment } from "../interfaces/comment.interface";
import Comment from "../models/Comment";

export const getAllCommentsByPostService = async (postId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
        Comment.find({ postId })
            .populate("userId", "fullname avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Comment.countDocuments({ postId })
    ]);

    return {
        comments,
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit)
    }
}

export const createCommentService = async (data: IComment, userId: string, postId: string) => {
    const { content } = data;

    const comment = await Comment.create({
        postId,
        userId,
        content
    });

    const populatedComment = await Comment.findById(comment._id)
        .populate("userId", "fullname avatar");

    return populatedComment;
}

export const updateCommentService = async (data: IComment, comment: any) => {
    comment.content = data.content.trim();
    comment.isEdited = true;

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
        .populate("userId", "fullname avatar");

    return populatedComment;
}

export const deleteCommentService = async (comment: any) => {
    await comment.deleteOne();
    
    return true;
}