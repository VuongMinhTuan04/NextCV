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
        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
            index: true
        },
        content: {
            type: String,
            required: true,
            maxLength: 255,
            trim: true
        },
        likes: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            default: []
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