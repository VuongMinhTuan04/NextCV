import Post from "../models/Post"

export const getAllPostService = async () => {
    return await Post.find();
}