import { eventHandler } from "./eventHandler";
import { leaveBalanceUseCase, leaveTypeRepository } from "../frameworks/di/resolver";

eventHandler.on("EMPLOYEE_CREATED", async (employeeId: string) => {
    try {
        const leaveTypes = await leaveTypeRepository.getAll();


        const leaveBalances = leaveTypes
            .map(leave => ({
                leaveTypeId: leave._id?.toString() || "",
                totalDays: leave.maxDaysAllowed,
                availableDays: leave.maxDaysAllowed,
            }));

        if (leaveBalances.length === 0) {
            console.warn("No valid leave types found. Skipping leave balance initialization.");
            return;
        }

        await leaveBalanceUseCase.initializeLeaveBalance(employeeId, leaveBalances);
    } catch (error) {
        console.error("Error initializing leave balance:", error);
    }
});

eventHandler.on("LEAVE_TYPE_ADDED", async (leaveTypeId: string, totalDays: number) => {
    try {
        await leaveBalanceUseCase.addLeaveTypeToAllEmployees(leaveTypeId, totalDays);
        console.log(`New leave type (${leaveTypeId}) added to all users.`);
    } catch (error) {
        console.error("Error updating leave balances for new leave type:", error);
    }
});

eventHandler.on("EMPLOYEE_DELETED" , async (employeeId : string)=> {
    try {
        await leaveBalanceUseCase.deleteLeaveBalance(employeeId);
        console.log("Leave balance deleted");
    } catch (error) {
        console.log("error deleting user leave balance" , error);
    }
})