import { Request, Response } from "express";

export interface ILeaveTypeController {
    createLeaveType(req: Request, res: Response): Promise<void>;
    getLeaveTypeById(req: Request, res: Response): Promise<void>;
    getAllLeaveTypes(req: Request, res: Response): Promise<void>;
    updateLeaveType(req: Request, res: Response): Promise<void>;
    deleteLeaveType(req: Request, res: Response): Promise<void>;
}
