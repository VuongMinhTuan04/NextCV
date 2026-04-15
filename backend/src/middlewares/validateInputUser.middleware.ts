import { NextFunction, Request, Response } from "express";

export const validateInputUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    next();
}