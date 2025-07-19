import { injectable, inject } from "tsyringe";
import { IMonthlySummaryRepository } from "../entities/repositoryInterfaces/IMonthlySummaryRepository";
import { IMonthlySummaryUseCase } from "../entities/useCaseInterface/IMonthlySummaryUseCase";
import { IMonthlyAttendanceSummary } from "../entities/models/IMonthlyAttendanceSummary";
import { CustomError } from "../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../shared/constants";

@injectable()
export class MonthlySummaryUseCase implements IMonthlySummaryUseCase {
    constructor(
        @inject("IMonthlySummaryRepository") private monthlySummaryRepo: IMonthlySummaryRepository,
    ) { }

    async generateSummary(month: number, year: number, generatedBy: {
        id: string,
        role: "admin" | "employee",
    },
        employeeId?: string
    ): Promise<IMonthlyAttendanceSummary | IMonthlyAttendanceSummary[]> {
        if (month < 1 || month > 12) throw new CustomError("Invalid month" , HTTP_STATUS_CODES.BAD_REQUEST);

        return await this.monthlySummaryRepo.generateSummary(month, year, generatedBy, employeeId);
    }

    async getExistingSummaries(month: number, year: number): Promise<IMonthlyAttendanceSummary[]> {
        return await this.monthlySummaryRepo.getExistingSummaries(month, year);
    }

    async regenerateSummary(month: number, year: number, generatedBy: {
        id: string,
        role: "admin" | "employee",
    }, employeeId?: string): Promise<IMonthlyAttendanceSummary | IMonthlyAttendanceSummary[]> {
        return await this.monthlySummaryRepo.regenerateSummary(month, year, generatedBy, employeeId);
    }

    async approveSummary(summaryId: string): Promise<IMonthlyAttendanceSummary> {
        return await this.monthlySummaryRepo.approveSummary(summaryId);
    }

    async rejectSummary(summaryId: string, reason: string): Promise<IMonthlyAttendanceSummary> {
        return await this.monthlySummaryRepo.rejectSummary(summaryId, reason);
    }

    async bulkApproveSummaries(summaryIds: string[]): Promise<IMonthlyAttendanceSummary[]> {
        if (summaryIds.length === 0) {
            throw new CustomError("No summary IDs provided" , HTTP_STATUS_CODES.BAD_REQUEST);
        }
        return await this.monthlySummaryRepo.bulkApproveSummaries(summaryIds);
    }
}