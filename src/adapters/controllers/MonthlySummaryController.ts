import { Request, Response } from "express";
import { IMonthlySummaryUseCase } from "../../entities/useCaseInterface/IMonthlySummaryUseCase";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { CustomRequest } from "../middlewares/authMiddleware";

@injectable()
export class MonthlySummaryController {
    constructor(
        @inject("IMonthlySummaryUseCase") private monthlySummaryUseCase: IMonthlySummaryUseCase,
    ) { }

    async generateSummary(req: Request, res: Response) {
        try {
            const { month, year, employeeId } = req.body;
            const generatedBy = (req as CustomRequest).user;

            const result = await this.monthlySummaryUseCase.generateSummary(
                parseInt(month),
                parseInt(year),
                {
                    id: generatedBy.id,
                    role: generatedBy.role as "admin" | "employee"
                },
                employeeId
            );

            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }

    async regenerateSummary(req: Request, res: Response) {
        try {
            const { month, year, employeeId } = req.body;
            const generatedBy = (req as CustomRequest).user;

            const result = await this.monthlySummaryUseCase.regenerateSummary(
                parseInt(month),
                parseInt(year),
                {
                    id: generatedBy.id,
                    role: generatedBy.role as "admin" | "employee"
                },
                employeeId
            );

            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }

    async getSummaries(req: Request, res: Response) {
        try {
            const { month, year } = req.query;
            const result = await this.monthlySummaryUseCase.getExistingSummaries(
                parseInt(month as string),
                parseInt(year as string)
            );
            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }

    async approveSummary(req: Request, res: Response) {
        try {
            const { summaryId } = req.params;
            const result = await this.monthlySummaryUseCase.approveSummary(summaryId,);
            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }

    async rejectSummary(req: Request, res: Response) {
        try {
            const { summaryId } = req.params;
            const { rejectionReason } = req.body;
            const result = await this.monthlySummaryUseCase.rejectSummary(summaryId, rejectionReason);
            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (error) {
            console.log(error)
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: (error instanceof Error) ? error.message : "",
            });
        }
    }

    async bulkApproveSummaries(req: Request, res: Response) {
        try {
            const { summaryIds } = req.body;
            if (!Array.isArray(summaryIds)) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: "summaryIds must be an array",
                });
            }
            const result = await this.monthlySummaryUseCase.bulkApproveSummaries(summaryIds);
            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (error) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                message: (error instanceof Error) ? error.message : "Failed to bulk approve summaries",
            });
        }
    }
}
