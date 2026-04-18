import { NOTIFICATION_TYPE } from "../constants/typeNotification";

export interface ICreateNotification {
    userId: string;
    fromUserId: string;
    postId: string;
    commentId?: string | null;
    type: NOTIFICATION_TYPE;
    message: string;
}