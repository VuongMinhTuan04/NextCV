import { Request, Response } from "express";
import {
    changeMyPasswordService,
    getInformationByIdService,
    searchFullnameUserService,
    updateMyInformationService,
} from "../services/information.service";

export const searchFullnameUserController = async (req: Request, res: Response) => {
    try {
        const fullname = String(req.query.fullname ?? "");
        const users = await searchFullnameUserService(fullname);

        res.status(200).json({ message: "[GET]: Search fullname user success", data: users });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const getInformationByIdController = async (req: Request, res: Response) => {
    try {
        const user = await getInformationByIdService(req.params.id as string);

        res.status(200).json({ message: "[GET]: Get information success", data: user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const updateMyInformationController = async (req: Request, res: Response) => {
    try {
        const authUser = (req as any).user;
        const userId = String(authUser?.userId ?? "");
        const file = req.file as Express.Multer.File | undefined;

        const user = await updateMyInformationService(userId, req.body, file);

        res.status(200).json({ message: "[PATCH]: Update information success", data: user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const changeMyPasswordController = async (req: Request, res: Response) => {
    try {
        const authUser = (req as any).user;
        const userId = String(authUser?.userId ?? "");

        await changeMyPasswordService(userId, req.body);

        res.status(200).json({  message: "[PATCH]: Change password success" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}