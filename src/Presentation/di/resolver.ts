import { container } from "tsyringe";
import { AdminController } from "../controllers/admin/AdminController";
import { RefreshController } from "../controllers/RefreshController";
import { DependencyInjection } from "./index";
import { AdminUserManagement } from "../controllers/admin/AdminUserManagement";
import { EmployeeController } from "../controllers/employee/EmployeeController";
import { EmployeeProfile } from "../controllers/employee/EmployeeProfileController";
import { LeaveTypeController } from "../controllers/LeaveTypeController";
import { LeaveBalanceController } from "../controllers/LeaveBalanceController";
import { LeaveRequestController } from "../controllers/LeaveRequestController";
import { ForgotPasswordController } from "../controllers/employee/ForgotPasswordController";
import { ResetPasswordController } from "../controllers/employee/ResetPasswordController";
import { AttendanceController } from "../controllers/AttendanceController";
import { MeetingController } from "../controllers/MeetingController";
import { FaqController } from "../controllers/FaqController";
import { MessageController } from "../controllers/MessageController";
import { GroupController } from "../controllers/GroupController";
import { QuestionController } from "../controllers/QuestionController";
import { MonthlySummaryController } from "../controllers/MonthlySummaryController";
import { PayrollController } from "../controllers/PayrollController";
import { PayslipController } from "../controllers/PDFHandlerController";
import { CronService } from "../../adapters/service/CronService";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveTypeRepository } from "../../adapters/repositories/LeaveTypeRepository";
import { EventService } from "../../shared/events";

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

const eventService = container.resolve<EventService>("EventService");
eventService.initialize();

export const messageController = container.resolve(MessageController);

export const groupController = container.resolve(GroupController);

export const questionController = container.resolve(QuestionController);

export const monthlySummaryController = container.resolve(MonthlySummaryController);

export const payrollController = container.resolve(PayrollController);

export const pdfController = container.resolve(PayslipController);

export const cronService = container.resolve(CronService);