import Post from "../models/Post"

export const getAllPostService = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    return await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
}

