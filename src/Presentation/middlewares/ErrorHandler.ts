import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../shared/errors/CustomError";


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    void next;

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
}