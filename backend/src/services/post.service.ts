import { IPost } from "../interfaces/post.interface";
import Post from "../models/Post"
import { deleteFileFromCloudinary, getFileType, uploadFileToCloudinary } from "../utils/file.util";

export const getAllPostService = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    return await Post.find()
        .populate("userId", "fullname avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
}

export const createPostService = async (data: IPost, file: Express.Multer.File, userId: string) => {
    const { title } = data;

    const uploadedFile = await uploadFileToCloudinary(file, "posts");

    return await Post.create({
        userId,
        title,
        fileUrl: uploadedFile.secure_url,
        filePublicId: uploadedFile.public_id,
        fileResourceType: uploadedFile.resource_type,
        fileType: getFileType(file.mimetype)
    });
}

export const likePostService = async (post: any, userId: string) => {
    const isLiked = post.likes.some((id: any) => id.toString() === userId);

    if(isLiked) {
        post.likes = post.likes.filter((id: any) => id.toString() !== userId);
    } else {
        post.likes.push(userId as any);
    }

    await post.save();

    return {
        liked: !isLiked,
        likesCount: post.likes.length,
    }
}

export const editPostService = async (post: any) => {
    return post;
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