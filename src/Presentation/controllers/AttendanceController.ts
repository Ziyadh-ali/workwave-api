import { Request, Response } from "express";
import { IAttendanceUseCase } from "../../entities/useCaseInterface/IAttendanceUseCase";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { MESSAGES } from "../../shared/constants";
import { CustomError } from "../../shared/errors/CustomError";
import { CustomRequest } from "../middlewares/AuthMiddleware";

@injectable()
export class AttendanceController {
    constructor(
        @inject("IAttendanceUseCase") private attendanceUseCase: IAttendanceUseCase,
    ) { }

    async checkIn(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        await this.attendanceUseCase.checkIn(employeeId);
        res.status(HTTP_STATUS_CODES.OK).json({
            message: MESSAGES.SUCCESS.CHECKED_IN
        });
    }

    async checkOut(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        await this.attendanceUseCase.checkOut(employeeId);
        res.status(HTTP_STATUS_CODES.OK).json({
            message: MESSAGES.SUCCESS.CHECKED_OUT
        });
    }

    async getTodayAttendance(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const todayAttendance = await this.attendanceUseCase.getTodayAttendance(employeeId)
        res.status(HTTP_STATUS_CODES.OK).json({
            todayAttendance,
        });
    }

    async getAttendanceByMonth(req: Request, res: Response): Promise<void> {
        const { employeeId } = req.params;
        const yearParam = req.query.year;
        const monthParam = req.query.month;

        if (typeof yearParam !== "string" || typeof monthParam !== "string") {
            throw new CustomError("Year and month must be provided as query parameters.", HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const year = parseInt(yearParam, 10);
        const month = parseInt(monthParam, 10);

        const attendancesOfMonth = await this.attendanceUseCase.getAttendanceByMonth(employeeId, year, month);

        res.status(HTTP_STATUS_CODES.OK).json({
            attendancesOfMonth,
        });

    }

    async getAllAttendanceByDate(req: Request, res: Response): Promise<void> {
        const { page = 1, pageSize = 10 } = req.query;

        const rawDate = req.query.date as string | undefined;
        const date = rawDate ? new Date(rawDate) : null;

        const attendances = await this.attendanceUseCase.getAllAttendanceByDate(date, Number(page), Number(pageSize));
        res.status(HTTP_STATUS_CODES.OK).json({
            attendances,
        });
    }

    async updateAttendance(req: Request, res: Response): Promise<void> {
        const { attendanceId } = req.params;
        const data = req.body.data as {
            status: "Present" | "Absent" | "Weekend" | "Holiday" | "Pending",
            checkInTime?: string,
            checkOutTime?: string,
        }

        const updatedAttendance = await this.attendanceUseCase.updateAttendance(attendanceId, data)

        res.status(HTTP_STATUS_CODES.OK).json({
            message: MESSAGES.SUCCESS.ATTENDANCDE_UPDATED,
            updatedAttendance,
        })
    }

    async getAllPendingRegularizationRequests(req: Request, res: Response): Promise<void> {
        const pendingAttendance = await this.attendanceUseCase.getAllPendingRegularizationRequests();
        res.status(HTTP_STATUS_CODES.OK).json({
            pendingAttendance,
        })
    }
    async requestRegularization(req: Request, res: Response): Promise<void> {
        const { attendanceId } = req.params;
        const requestedBy = (req as CustomRequest).user.id.toString();
        const { reason } = req.body;
        const pendingAttendnace = await this.attendanceUseCase.requestRegularization(attendanceId, {requestedBy, reason});
        res.status(HTTP_STATUS_CODES.OK).json({
            pendingAttendnace,
        })
    }

    async respondToRegularizationRequest(req: Request, res: Response): Promise<void> {

        const { attendanceId } = req.params;
        const { remarks } = req.body;
        const action = req.query.action as unknown as "Approved" | "Rejected"

        await this.attendanceUseCase.respondToRegularizationRequest(attendanceId, action, remarks);
        res.status(HTTP_STATUS_CODES.OK).json({
            message: `Regularization ${action}`,
        })
    }
}