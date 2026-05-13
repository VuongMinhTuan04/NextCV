import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true,
            maxLength: 255,
            trim: true
        },
        attachment: {
            name: String,
            url: String,
            publicId: String,
            resourceType: String,
            kind: String
        },
        fileName: {
            type: String,
            default: ""
        },
        fileUrl: {
            type: String,
            default: ""
        },
        filePublicId: {
            type: String,
            default: ""
        },
        fileResourceType: {
            type: String,
            enum: ["image", "raw"],
            default: "raw"
        },
        fileType: {
            type: String,
            enum: ["image", "pdf", "doc"],
            default: "image"
        },
        isEdited: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema, "Comments");