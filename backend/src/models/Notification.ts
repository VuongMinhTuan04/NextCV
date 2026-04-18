import mongoose from "mongoose";
import { NOTIFICATION_TYPE } from "../constants/typeNotification";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
            index: true
        },
        type: {
            type: String,
            enum: Object.values(NOTIFICATION_TYPE),
            required: true,
            index: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema, "Notifications");