import mongoose from "mongoose";
import { IComment } from "../interfaces/comment.interface";
import Comment from "../models/Comment";
import { createNotificationService, deleteNotificationByActionService } from "./notification.service";
import { NOTIFICATION_TYPE } from "../constants/typeNotification";
import User from "../models/User";

const collectCommentTreeIds = async (rootCommentId: string) => {
    const allIds = [rootCommentId];
    let queue = [rootCommentId];

    while (queue.length > 0) {
        const children = await Comment.find({ parentCommentId: { $in: queue } })
            .select("_id");

        const childIds = children.map((child) => child._id.toString());

        if (childIds.length === 0) {
            break;
        }

        allIds.push(...childIds);
        queue = childIds;
    }

    return allIds;
}

export const getAllCommentsByPostService = async (postId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
        Comment.find({ postId })
            .populate("userId", "fullname avatar")
            .populate({
                path: "parentCommentId",
                populate: {
                    path: "userId",
                    select: "fullname avatar"
                }
            })
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

export const createCommentService = async (data: IComment, userId: string, post: any) => {
    const { content, parentCommentId } = data;
    let parentComment  = null;

    if (parentCommentId) {
        if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
            throw new Error("Invalid parent comment id");
        }

        parentComment = await Comment.findById(parentCommentId);

        if (!parentComment) {
            throw new Error("Parent comment not found");
        }

        if (parentComment.postId.toString() !== post._id.toString()) {
            throw new Error("Parent comment does not belong to this post");
        }
    }

    const comment = await Comment.create({
        postId: post._id,
        userId,
        content,
        parentCommentId: parentComment ? parentComment._id : null
    });

    const actor = await User.findById(userId).select("fullname");

    if (parentComment) {
        await createNotificationService({
            userId: parentComment.userId.toString(),
            fromUserId: userId,
            postId: post._id.toString(),
            commentId: comment._id.toString(),
            type: NOTIFICATION_TYPE.REPLY_COMMENT,
            message: `${actor?.fullname ?? "Một người dùng"} vừa trả lời bình luận của bạn`
        });
    } else {
        await createNotificationService({
            userId: post.userId.toString(),
            fromUserId: userId,
            postId: post._id.toString(),
            commentId: comment._id.toString(),
            type: NOTIFICATION_TYPE.COMMENT_POST,
            message: `${actor?.fullname ?? "Một người dùng"} vừa bình luận bài viết của bạn`
        });
    }

    const populatedComment = await Comment.findById(comment._id)
        .populate("userId", "fullname avatar")
        .populate({
            path: "parentCommentId",
            populate: {
                path: "userId",
                select: "fullname avatar"
            }
        });

    return populatedComment;
}

export const likeCommentService = async (comment: any, userId: string) => {
    const isLiked = comment.likes.some((id: any) => id.toString() === userId);

    const actor = await User.findById(userId).select("fullname");

    if (isLiked) {
        comment.likes = comment.likes.filter((id: any) => id.toString() !== userId);

        await comment.save();

        await deleteNotificationByActionService({
            userId: comment.userId.toString(),
            fromUserId: userId,
            postId: comment.postId.toString(),
            commentId: comment._id.toString(),
            type: NOTIFICATION_TYPE.LIKE_COMMENT
        });

        return {
            liked: false,
            likesCount: comment.likes.length
        }
    }

    comment.likes.push(userId as any);
    await comment.save();

    await createNotificationService({
        userId: comment.userId.toString(),
        fromUserId: userId,
        postId: comment.postId.toString(),
        commentId: comment._id.toString(),
        type: NOTIFICATION_TYPE.LIKE_COMMENT,
        message: `${actor?.fullname ?? "Một người dùng"} vừa thích bình luận của bạn`
    });

    return {
        liked: true,
        likesCount: comment.likes.length
    }
}

export const updateCommentService = async (data: IComment, comment: any) => {
    comment.content = data.content;
    comment.isEdited = true;

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
        .populate("userId", "fullname avatar")
        .populate({
            path: "parentCommentId",
            populate: {
                path: "userId",
                select: "fullname avatar"
            }
        });

    return populatedComment;
}

export const deleteCommentService = async (comment: any) => {
    const idsToDelete = await collectCommentTreeIds(comment._id.toString());

    await Comment.deleteMany({ _id: { $in: idsToDelete } });
    
    return true;
}