import mongoose from "mongoose";
import { IComment } from "../interfaces/comment.interface";
import Comment from "../models/Comment";
import { createNotificationService, deleteNotificationByActionService } from "./notification.service";
import { NOTIFICATION_TYPE } from "../constants/typeNotification";
import User from "../models/User";
import { deleteFileFromCloudinary } from "../utils/file.util";

const collectCommentTreeIds = async (rootCommentId: string) => {
    const allIds = [rootCommentId];
    let queue = [rootCommentId];

    while (queue.length > 0) {
        const children = await Comment.find({ parentCommentId: { $in: queue } }).select("_id");
        const childIds = children.map((child) => child._id.toString());

        if (childIds.length === 0) {
            break;
        }

        allIds.push(...childIds);
        queue = childIds;
    }

    return allIds;
}

const resolveAttachmentName = (comment: any) => {
  if (comment.fileName) return comment.fileName;

  try {
    const url = new URL(comment.fileUrl);
    const name = decodeURIComponent(url.pathname.split("/").pop() || "");
    if (name) return name;
  } catch {}

  if (comment.fileType === "pdf") return "document.pdf";
  if (comment.fileType === "doc") return "document.docx";
  return "image";
};

const mapCommentToClient = (comment: any) => {
    const user = comment.userId ?? {};

    const kind =
        comment.fileType === "doc"
            ? "word"
            : comment.fileType === "pdf"
            ? "pdf"
            : "image";

    return {
        id: String(comment._id),
        user: {
            id: String(user._id ?? ""),
            fullName: user.fullname ?? "",
            avatar: user.avatar ?? "user.png",
        },
        content: comment.content ?? "",
        createdAt: comment.createdAt,
        attachment: comment.fileUrl
        ? {
            name: resolveAttachmentName(comment),
            url: String(comment.fileUrl),
            kind,
        }
        : undefined,
    }
}

export const getAllCommentsByPostService = async (postId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
        Comment.find({ postId })
            .populate("userId", "fullname avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Comment.countDocuments({ postId })
    ]);

    return {
        comments: comments.map(mapCommentToClient),
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit)
    }
}

export const createCommentService = async (data: any, userId: string, post: any) => {
    const comment = await Comment.create({
        postId: post._id,
        userId,
        content: data.content,

        fileName: data.fileName || "",
        fileUrl: data.fileUrl || "",
        filePublicId: data.filePublicId || "",
        fileResourceType: data.fileResourceType || "raw",
        fileType: data.fileType || "image"
    });

    const actor = await User.findById(userId).select("fullname");

    await createNotificationService({
        userId: post.userId.toString(),
        fromUserId: userId,
        postId: post._id.toString(),
        commentId: comment._id.toString(),
        type: NOTIFICATION_TYPE.COMMENT_POST,
        message: `${actor?.fullname ?? "Một người dùng"} vừa bình luận bài viết của bạn`
    });

    const populated = await Comment.findById(comment._id)
        .populate("userId", "fullname avatar");

    return mapCommentToClient(populated);
}

export const updateCommentService = async (data: IComment, comment: any) => {
    comment.content = data.content;
    comment.isEdited = true;

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
        .populate("userId", "fullname avatar");

    return mapCommentToClient(populatedComment);
}

export const deleteCommentService = async (comment: any) => {
    const commentIds = await collectCommentTreeIds(comment._id.toString());

    const comments = await Comment.find({
        _id: { $in: commentIds }
    });

    for (const item of comments) {
        if (item.filePublicId) {
            await deleteFileFromCloudinary(
                item.filePublicId,
                item.fileResourceType || "raw"
            );
        }
    }

    await Comment.deleteMany({
        _id: { $in: commentIds }
    });

    await mongoose.model("Notification").deleteMany({
        $or: [
            {
                commentId: { $in: commentIds }
            },
            {
                postId: comment.postId
            }
        ],
        type: {
            $in: [
                NOTIFICATION_TYPE.COMMENT_POST,
                NOTIFICATION_TYPE.REPLY_COMMENT
            ]
        }
    });

    return true;
}