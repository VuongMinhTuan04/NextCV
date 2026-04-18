import { Request, Response } from "express"
import {
    getAllNotificationsService,
    markAllNotificationsAsReadService,
    markNotificationAsReadService
} from "../services/notification.service";

export const getAllNotificationsController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const type = req.query.type as string | undefined;

        const notification = await getAllNotificationsService(user.userId, page, limit, type);

        res.status(200).json({ message: "[GET]: Get All Notification Success", data: notification });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const markNotificationAsReadController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const notification = await markNotificationAsReadService(req.params.id as string, user.userId);

        res.status(200).json({ message: "[PATCH]: Mark Notification As Read Success", data: notification });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const markAllNotificationsAsReadController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        await markAllNotificationsAsReadService(user.userId);

        res.status(200).json({ message: "[PATCH]: Mark All Notifications As Read Success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}