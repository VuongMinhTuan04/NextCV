import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        type: {
            type: String,
            enum: ["comment", "like"],
            default: "comment"
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Notification", notificationSchema, "Notifications");