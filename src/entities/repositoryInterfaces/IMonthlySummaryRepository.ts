import { IMonthlyAttendanceSummary } from "../models/IMonthlyAttendanceSummary";

export interface IMonthlySummaryRepository  {
    generateSummary(month: number, year: number, generatedBy: {
        id : string,
        role : "admin" | "employee",
      }, employeeId?: string): Promise<IMonthlyAttendanceSummary | IMonthlyAttendanceSummary[]>;
    regenerateSummary(month: number, year: number, generatedBy: {
        id : string,
        role : "admin" | "employee",
      }, employeeId?: string): Promise<IMonthlyAttendanceSummary | IMonthlyAttendanceSummary[]>;
    getExistingSummaries(month: number, year: number): Promise<IMonthlyAttendanceSummary[]>;
    approveSummary(summaryId: string): Promise<IMonthlyAttendanceSummary>;
    rejectSummary(
        summaryId: string,
        reason: string
    ): Promise<IMonthlyAttendanceSummary>;
    bulkApproveSummaries(summaryIds: string[]): Promise<IMonthlyAttendanceSummary[]>;
}