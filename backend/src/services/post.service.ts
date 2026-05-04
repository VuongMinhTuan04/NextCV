import { NOTIFICATION_TYPE } from "../constants/typeNotification";
import { IPost } from "../interfaces/post.interface";
import Post from "../models/Post"
import User from "../models/User";
import { deleteFileFromCloudinary, getFileType, uploadFileToCloudinary } from "../utils/file.util";
import { createNotificationService, deleteNotificationByActionService } from "./notification.service";

type PostClientShape = {
    id: string
    user: {
        id: string
        fullName: string
        avatar: string
    }
    title: string
    createdAt: string
    attachment: {
        name: string
        url: string
        kind: "image" | "pdf" | "word"
    }
    liked: boolean
    likes: number
    comments: []
}

const formatRelativeTime = (value: Date | string) => {
    const date = new Date(value);
    const diff = Date.now() - date.getTime();

    if (Number.isNaN(date.getTime()) || diff < 0) {
        return "Vừa xong";
    }

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
        return "Vừa xong";
    }

    if (diff < hour) {
        return `${Math.floor(diff / minute)} phút trước`;
    }

    if (diff < day) {
        return `${Math.floor(diff / hour)} giờ trước`;
    }

    return `${Math.floor(diff / day)} ngày trước`;
}

const resolveAttachmentName = (post: any) => {
    const fileName = typeof post.fileName === "string" ? post.fileName.trim() : "";
    if (fileName) {
        return fileName;
    }

    try {
        const pathname = new URL(String(post.fileUrl ?? "")).pathname;
        const lastSegment = pathname.split("/").pop() ?? "";
        const decoded = decodeURIComponent(lastSegment).trim();
        if (decoded) {
            return decoded;
        }
    } catch {
    }

    if (post.fileType === "image") return "image";
    if (post.fileType === "pdf") return "document.pdf";
    return "document.docx";
}

const mapPostToClient = (post: any): PostClientShape => {
    const user = post.userId ?? {};

    const kind =
        post.fileType === "doc"
            ? "word"
            : post.fileType === "pdf"
            ? "pdf"
            : "image";

    const fileName = resolveAttachmentName(post);

    return {
        id: String(post._id),
        user: {
            id: String(user._id ?? ""),
            fullName: user.fullname ?? "",
            avatar: user.avatar ?? "user.png",
        },
        title: post.title ?? "",
        createdAt: formatRelativeTime(post.createdAt),
        attachment: {
            name: fileName,
            url: String(post.fileUrl ?? ""),
            kind,
        },
        liked: false,
        likes: Array.isArray(post.likes) ? post.likes.length : 0,
        comments: [],
    }
}

export const getAllPostService = async (page: number, limit: number, userId?: string): Promise<PostClientShape[]> => {
    const skip = (page - 1) * limit;

    const posts = await Post.find()
        .populate("userId", "_id fullname avatar")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return posts.map(mapPostToClient);
}

export const createPostService = async (
    data: IPost,
    file: Express.Multer.File,
    userId: string
): Promise<PostClientShape> => {
    const uploadedFile = await uploadFileToCloudinary(file, "NextCV/posts");

    const post = await Post.create({
        userId,
        title: data.title,
        fileName: file.originalname,
        fileUrl: uploadedFile.secure_url,
        filePublicId: uploadedFile.public_id,
        fileResourceType: uploadedFile.resource_type,
        fileType: getFileType(file.mimetype),
        createdAt: new Date()
    });

    await post.populate("userId", "_id fullname avatar");

    return mapPostToClient(post.toObject());
}

export const likePostService = async (post: any, userId: string) => {
    const isLiked = post.likes.some((id: any) => id.toString() === userId);

    const actor = await User.findById(userId).select("fullname");

    if (isLiked) {
        post.likes = post.likes.filter((id: any) => id.toString() !== userId);

        await post.save();

        await deleteNotificationByActionService({
            userId: post.userId.toString(),
            fromUserId: userId,
            postId: post._id.toString(),
            commentId: null,
            type: NOTIFICATION_TYPE.LIKE_POST
        });

        return {
            liked: false,
            likesCount: post.likes.length
        };
    }

    post.likes.push(userId as any);
    await post.save();

    await createNotificationService({
        userId: post.userId.toString(),
        fromUserId: userId,
        postId: post._id.toString(),
        commentId: null,
        type: NOTIFICATION_TYPE.LIKE_POST,
        message: `${actor?.fullname ?? "Một người dùng"} vừa thích bài viết của bạn`
    });

    return {
        liked: true,
        likesCount: post.likes.length
    }
}

export const updatePostService = async (data: IPost, post: any) => {
    post.title = data.title;

    await post.save();

    return post;
}

export const deletePostService = async (post: any) => {
    await deleteFileFromCloudinary(
        post.filePublicId,
        post.fileResourceType
    );

    await post.deleteOne();

    return true;
}