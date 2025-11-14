import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../shared/errors/CustomError";


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Unhandled error", err);
    console.error("Error name:", err.constructor.name);
    console.error("Is instance of CustomError?", err instanceof CustomError);
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