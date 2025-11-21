import { MonthlyAttendanceSummaryResponseDTO, MonthlyAttendanceSummaryWithEmployeeResponseDTO } from "../dtos/ResponseDTOs/MonthlySummaryDTO";

export interface IMonthlySummaryUseCase {
    generateSummary(
        month: number,
        year: number,
        generatedBy: {
            id: string,
            role: "admin" | "employee",
        },
        employeeId?: string
    ): Promise<MonthlyAttendanceSummaryResponseDTO | MonthlyAttendanceSummaryResponseDTO[]>;

    regenerateSummary(
        month: number,
        year: number,
        generatedBy: {
            id: string,
            role: "admin" | "employee",
        },
        employeeId?: string
    ): Promise<MonthlyAttendanceSummaryResponseDTO | MonthlyAttendanceSummaryResponseDTO[]>;

    getExistingSummaries(
        month: number,
        year: number
    ): Promise<MonthlyAttendanceSummaryWithEmployeeResponseDTO[]>;

    approveSummary(summaryId: string): Promise<MonthlyAttendanceSummaryResponseDTO>;
    rejectSummary(
        summaryId: string,
        reason: string
    ): Promise<MonthlyAttendanceSummaryResponseDTO>;
    bulkApproveSummaries(summaryIds: string[]): Promise<MonthlyAttendanceSummaryResponseDTO[]>
}