import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        fileUrl: {
            type: String,
            required: true,
            trim: true
        },
        filePublicId: {
            type: String,
            required: true
        },
        fileResourceType: {
            type: String,
            enum: ["image", "raw"],
            required: true
        },
        fileType: {
            type: String,
            enum: ["image", "pdf", "doc"],
            required: true
        },
        likes: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Post", postSchema, "Posts");