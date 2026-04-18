import { ICreateNotification } from "../interfaces/notification.interface";
import Notification from "../models/Notification";

export const createNotificationService = async (data: ICreateNotification) => {
    if (data.userId === data.fromUserId) {
        return null;
    }

    return await Notification.create(data);
}

export const deleteNotificationByActionService = async (
    data: Pick<ICreateNotification, "userId" | "fromUserId" | "postId" | "commentId" | "type">
) => {
    await Notification.deleteOne({
        userId: data.userId,
        fromUserId: data.fromUserId,
        postId: data.postId,
        commentId: data.commentId ?? null,
        type: data.type
    });

    return true;
}

export const getAllNotificationsService = async (userId: string, page: number, limit: number, type?: string) => {
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { userId }

    if (type) {
        query.type = type;
    }

    const [notifications, totalNotifications, unreadCount] = await Promise.all([
        Notification.find(query)
            .populate("fromUserId", "fullname avatar")
            .populate("postId", "title fileUrl fileType")
            .populate({
                path: "commentId",
                select: "content userId postId parentCommentId",
                populate: {
                    path: "userId",
                    select: "fullname avatar"
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Notification.countDocuments(query),
        Notification.countDocuments({ userId, isRead: false })
    ]);

    return {
        notifications,
        page,
        limit,
        totalNotifications,
        totalPages: Math.ceil(totalNotifications / limit),
        unreadCount
    }
}

export const markNotificationAsReadService = async (notificationId: string, userId: string) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new Error("Không tìm thấy thông báo");
    }

    if (notification.userId.toString() !== userId) {
        throw new Error("Bạn không có quyền truy cập");
    }

    notification.isRead = true;
    await notification.save();

    return notification;
}

export const markAllNotificationsAsReadService = async (userId: string) => {
    await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
    );

    return true;
}