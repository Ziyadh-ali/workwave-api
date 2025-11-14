import { injectable, inject } from "tsyringe";
import { eventHandler } from "./eventHandler";
import { ILeaveBalanceUseCase } from "../entities/useCaseInterface/ILeaveBalanceUseCase";
import { ILeaveTypeUseCase } from "../entities/useCaseInterface/ILeaveTypeUseCase";

@injectable()
export class EventService {
    constructor(
        @inject("ILeaveBalanceUseCase")
        private leaveBalanceUseCase: ILeaveBalanceUseCase,

        @inject("ILeaveTypeUseCase")
        private leaveTypeUseCase: ILeaveTypeUseCase
    ) {}

    initialize() {
        /** ------------------------------------
         *  EMPLOYEE CREATED
         * ------------------------------------ */
        eventHandler.on("EMPLOYEE_CREATED", async (employeeId: string) => {
            try {
                const leaveTypes = await this.leaveTypeUseCase.getEveryLeaveType();

                const leaveBalances = leaveTypes.map((leave) => ({
                    leaveTypeId: leave._id!.toString(),
                    totalDays: leave.maxDaysAllowed,
                    availableDays: leave.maxDaysAllowed,
                }));

                if (leaveBalances.length === 0) {
                    console.warn("No leave types found — skipping initialization.");
                    return;
                }

                await this.leaveBalanceUseCase.initializeLeaveBalance(
                    employeeId,
                    leaveBalances
                );

                console.log("Leave balance initialized for:", employeeId);
            } catch (error) {
                console.error("Error initializing leave balance:", error);
            }
        });

        /** ------------------------------------
         *  LEAVE TYPE ADDED
         * ------------------------------------ */
        eventHandler.on(
            "LEAVE_TYPE_ADDED",
            async (leaveTypeId: string, totalDays: number) => {
                try {
                    await this.leaveBalanceUseCase.addLeaveTypeToAllEmployees(
                        leaveTypeId,
                        totalDays
                    );

                    console.log(
                        `Leave type added to all employees: ${leaveTypeId}`
                    );
                } catch (error) {
                    console.error("Error adding leave type:", error);
                }
            }
        );

        /** ------------------------------------
         *  EMPLOYEE DELETED
         * ------------------------------------ */
        eventHandler.on("EMPLOYEE_DELETED", async (employeeId: string) => {
            try {
                await this.leaveBalanceUseCase.deleteLeaveBalance(employeeId);
                console.log("Leave balance deleted for employee:", employeeId);
            } catch (error) {
                console.error("Error deleting leave balance:", error);
            }
        });
    }
}
