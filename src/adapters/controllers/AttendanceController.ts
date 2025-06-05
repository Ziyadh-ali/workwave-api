import { Request, Response } from "express";
import { IAttendanceUseCase } from "../../entities/useCaseInterface/IAttendanceUseCase";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { MESSAGES } from "../../shared/constants";
import { CustomRequest } from "../middlewares/authMiddleware";

@injectable()
export class AttendanceController {
    constructor(
        @inject("IAttendanceUseCase") private attendanceUseCase: IAttendanceUseCase,
    ) { }

    async checkIn(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            await this.attendanceUseCase.checkIn(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.CHECKED_IN
            });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.CHECK_IN_FAILED,
            });
        }
    }

    async checkOut(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            await this.attendanceUseCase.checkOut(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.CHECKED_OUT
            });
        } catch (error) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.CHECK_OUT_FAILED,
            });
        }
    }

    async getTodayAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const todayAttendance = await this.attendanceUseCase.getTodayAttendance(employeeId)
            res.status(HTTP_STATUS_CODES.OK).json({
                todayAttendance,
            });
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }

    async getAttendanceByMonth(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const yearParam = req.query.year;
            const monthParam = req.query.month;

            if (typeof yearParam !== "string" || typeof monthParam !== "string") {
                throw new Error("Year and month must be provided as query parameters.");
            }

            const year = parseInt(yearParam, 10);
            const month = parseInt(monthParam, 10);

            const attendancesOfMonth = await this.attendanceUseCase.getAttendanceByMonth(employeeId, year, month);

            res.status(HTTP_STATUS_CODES.OK).json({
                attendancesOfMonth,
            });

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }

    async getAllAttendanceByDate(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, pageSize = 10 } = req.query;

            const rawDate = req.query.date as string | undefined;
            const date = rawDate ? new Date(rawDate) : null;

            const attendances = await this.attendanceUseCase.getAllAttendanceByDate(date, Number(page), Number(pageSize));
            res.status(HTTP_STATUS_CODES.OK).json({
                attendances,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }

    async updateAttendance(req: Request, res: Response): Promise<void> {
        try {
            const { attendanceId } = req.params;
            const status = req.query.status as unknown as "Present" | "Absent" | "Weekend" | "Holiday" | "Pending" | "Late";

            const updatedAttendance = await this.attendanceUseCase.updateStatus(attendanceId, status);

            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.ATTENDANCDE_UPDATED,
                updatedAttendance,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }

    async getAllPendingRegularizationRequests(req: Request, res: Response): Promise<void> {
        try {
            const pendingAttendance = await this.attendanceUseCase.getAllPendingRegularizationRequests();
            res.status(HTTP_STATUS_CODES.OK).json({
                pendingAttendance,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }
    async requestRegularization(req: Request, res: Response): Promise<void> {
        try {
            const { attendanceId } = req.params;
            const requestedBy = (req as CustomRequest).user.id;
            const { reason } = req.body;

            const pendingAttendnace = await this.attendanceUseCase.requestRegularization(attendanceId, requestedBy.toString(), reason);
            res.status(HTTP_STATUS_CODES.OK).json({
                pendingAttendnace,
            })
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }

    async respondToRegularizationRequest(req: Request, res: Response): Promise<void> {
        try {

            const { attendanceId } = req.params;
            const { remarks } = req.body;
            const action = req.query.action as unknown as "Approved" | "Rejected"

            await this.attendanceUseCase.respondToRegularizationRequest(attendanceId, action, remarks);
            res.status(HTTP_STATUS_CODES.OK).json({
                message : `Regularization ${action}`,
            })

        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.ATTENDANCE.ERROR_IN_FETCHING,
            });
        }
    }
}