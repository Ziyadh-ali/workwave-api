import { injectable, inject } from "tsyringe";
import { IMonthlySummaryRepository } from "../entities/repositoryInterfaces/IMonthlySummaryRepository";
import { IMonthlySummaryUseCase } from "../entities/useCaseInterface/IMonthlySummaryUseCase";
import { CustomError } from "../shared/errors/CustomError";
import { HTTP_STATUS_CODES } from "../shared/constants";
import {
  MonthlyAttendanceSummaryResponseDTO,
  MonthlyAttendanceSummaryWithEmployeeResponseDTO,
} from "../entities/dtos/ResponseDTOs/MonthlySummaryDTO";
import { MonthlyAttendanceSummaryMapper } from "../entities/mapping/MonthlySummaryMapper";

@injectable()
export class MonthlySummaryUseCase implements IMonthlySummaryUseCase {
  constructor(
    @inject("IMonthlySummaryRepository")
    private _monthlySummaryRepo: IMonthlySummaryRepository
  ) {}

  async generateSummary(
    month: number,
    year: number,
    generatedBy: {
      id: string;
      role: "admin" | "employee";
    },
    employeeId?: string
  ): Promise<
    MonthlyAttendanceSummaryResponseDTO | MonthlyAttendanceSummaryResponseDTO[]
  > {
    if (month < 1 || month > 12)
      throw new CustomError("Invalid month", HTTP_STATUS_CODES.BAD_REQUEST);

    const summaries = await this._monthlySummaryRepo.generateSummary(
      month,
      year,
      generatedBy,
      employeeId
    );
    if (Array.isArray(summaries)) {
      return summaries.map(MonthlyAttendanceSummaryMapper.toResponseDTO);
    }

    return MonthlyAttendanceSummaryMapper.toResponseDTO(summaries);
  }

  async getExistingSummaries(
    month: number,
    year: number
  ): Promise<MonthlyAttendanceSummaryWithEmployeeResponseDTO[]> {
    const summaries = await this._monthlySummaryRepo.getExistingSummaries(
      month,
      year
    );
    return summaries.map(
      MonthlyAttendanceSummaryMapper.toWithEmployeeResponseDTO
    );
  }

  async regenerateSummary(
    month: number,
    year: number,
    generatedBy: {
      id: string;
      role: "admin" | "employee";
    },
    employeeId?: string
  ): Promise<
    MonthlyAttendanceSummaryResponseDTO | MonthlyAttendanceSummaryResponseDTO[]
  > {
    const summaries = await this._monthlySummaryRepo.regenerateSummary(
      month,
      year,
      generatedBy,
      employeeId
    );

    if (Array.isArray(summaries)) {
      return summaries.map(MonthlyAttendanceSummaryMapper.toResponseDTO);
    }

    return MonthlyAttendanceSummaryMapper.toResponseDTO(summaries);
  }

  async approveSummary(
    summaryId: string
  ): Promise<MonthlyAttendanceSummaryResponseDTO> {
    const summary = await this._monthlySummaryRepo.approveSummary(summaryId);

    if (!summary) {
      throw new CustomError("Summary not found", HTTP_STATUS_CODES.NOT_FOUND);
    }

    return MonthlyAttendanceSummaryMapper.toResponseDTO(summary);
  }

  async rejectSummary(
    summaryId: string,
    reason: string
  ): Promise<MonthlyAttendanceSummaryResponseDTO> {
    const summary = await this._monthlySummaryRepo.rejectSummary(
      summaryId,
      reason
    );

    if (!summary) {
      throw new CustomError("Summary not found", HTTP_STATUS_CODES.NOT_FOUND);
    }

    return MonthlyAttendanceSummaryMapper.toResponseDTO(summary);
  }

  async bulkApproveSummaries(
    summaryIds: string[]
  ): Promise<MonthlyAttendanceSummaryResponseDTO[]> {
    if (summaryIds.length === 0) {
      throw new CustomError(
        "No summary IDs provided",
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const summaries = await this._monthlySummaryRepo.bulkApproveSummaries(
      summaryIds
    );

    return summaries.map(MonthlyAttendanceSummaryMapper.toResponseDTO);
  }
}
