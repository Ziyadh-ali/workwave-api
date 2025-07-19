import { container } from "tsyringe";
import { AdminController } from "../../adapters/controllers/admin/adminController";
import { RefreshController } from "../../adapters/controllers/refreshController";
import { DependencyInjection } from "./index";
import { AdminUserManagement } from "../../adapters/controllers/admin/AdminUserManagement";
import { EmployeeController } from "../../adapters/controllers/employee/employeeController";
import { EmployeeProfile } from "../../adapters/controllers/employee/employeeProfileController";
import { LeaveTypeController } from "../../adapters/controllers/LeaveTypeController";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { LeaveBalanceController } from "../../adapters/controllers/LeaveBalanceController";
import { LeaveRequestController } from "../../adapters/controllers/LeaveRequestController";
import { ForgotPasswordController } from "../../adapters/controllers/employee/ForgotPasswordController";
import { ResetPasswordController } from "../../adapters/controllers/employee/ResetPasswordController";
import { AttendanceController } from "../../adapters/controllers/AttendanceController";
import { MeetingController } from "../../adapters/controllers/MeetingController";
import { FaqController } from "../../adapters/controllers/FaqController";
// import { SocketManager } from "../../shared/socket/socketManager";
import { MessageController } from "../../adapters/controllers/MessageController";
import { ProjectController } from "../../adapters/controllers/ProjectController";
import { GroupController } from "../../adapters/controllers/GroupController";
import { QuestionController } from "../../adapters/controllers/QuestionController";
import { MonthlySummaryController } from "../../adapters/controllers/MonthlySummaryController";
import { PayrollController } from "../../adapters/controllers/PayrollController";
import { PayslipController } from "../../adapters/controllers/PDFHandlerController";
import { CronService } from "../../adapters/service/cronService";

DependencyInjection.registerAll();

export const adminController = container.resolve(AdminController);

export const refreshController = container.resolve(RefreshController);

export const adminUserManagement = container.resolve(AdminUserManagement);

export const employeeController = container.resolve(EmployeeController);

export const employeeProfile = container.resolve(EmployeeProfile);

export const leaveTypeController = container.resolve(LeaveTypeController);

export const leaveBalanceUseCase = container.resolve(LeaveBalanceUseCase);

export const leaveTypeRepository = container.resolve(LeaveTypeRepository);

export const leaveBalanceController = container.resolve(LeaveBalanceController);

export const leaveRequestController = container.resolve(LeaveRequestController);

export const forgotPasswordController = container.resolve(ForgotPasswordController);

export const resetPasswordController = container.resolve(ResetPasswordController);

export const attendanceController = container.resolve(AttendanceController);

export const meetingController = container.resolve(MeetingController);

export const faqController = container.resolve(FaqController);

// export const socketManager = container.resolve(SocketManager);

export const messageController = container.resolve(MessageController);

export const projectController = container.resolve(ProjectController);

export const groupController = container.resolve(GroupController);

export const questionController = container.resolve(QuestionController);

export const monthlySummaryController = container.resolve(MonthlySummaryController);

export const payrollController = container.resolve(PayrollController);

export const pdfController = container.resolve(PayslipController);

export const cronService = container.resolve(CronService);