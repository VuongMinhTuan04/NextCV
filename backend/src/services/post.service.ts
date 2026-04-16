import Post from "../models/Post"
import { getFileType, uploadFileToCloudinary } from "../utils/file.util";

export const getAllPostService = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    return await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
}

export const createPostService = async (data: any, file: Express.Multer.File, userId: string) => {
    const { title } = data;

    const uploadedFile = await uploadFileToCloudinary(file, "posts");

    return await Post.create({
        userId,
        title,
        fileUrl: uploadedFile.secure_url,
        fileType: getFileType(file.mimetype)
    });
}

export const likePostService = async (postId: string, userId: string) => {
    const post = await Post.findById(postId);
    if(!post) {
        throw new Error("Không tìm thấy bài đăng");
    }

    const isLiked = post.likes.some(
        (id: any) => id.toString() === userId
    );

    if(isLiked) {
        post.likes = post.likes.filter(
            (id: any) => id.toString() !== userId
        );

        await post.save();

        return {
            liked: false,
            likesCount: post.likes.length,
            post
        }
    }

    post.likes.push(userId as any);
    await post.save();

    return {
        liked: true,
        likesCount: post.likes.length,
        post
    }
}