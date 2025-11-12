import { container } from "tsyringe";
import { AdminController } from "../controllers/admin/AdminController";
import { RefreshController } from "../controllers/RefreshController";
import { AdminUserManagement } from "../controllers/admin/AdminUserManagement";
import { EmployeeController } from "../controllers/employee/EmployeeController";
import { EmployeeProfile } from "../controllers/employee/EmployeeProfileController";
import { LeaveTypeController } from "../controllers/LeaveTypeController";
import { LeaveBalanceController } from "../controllers/LeaveBalanceController";
import { LeaveRequestController } from "../controllers/LeaveRequestController";
import { ForgotPasswordController } from "../controllers/employee/ForgotPasswordController";
import { ResetPasswordController } from "../controllers/employee/ResetPasswordController";
import { MeetingController } from "../controllers/MeetingController";
import { FaqController } from "../controllers/FaqController";
import { MessageController } from "../controllers/MessageController";
import { GroupController } from "../controllers/GroupController";
import { QuestionController } from "../controllers/QuestionController";
import { MonthlySummaryController } from "../controllers/MonthlySummaryController";
import { PayrollController } from "../controllers/PayrollController";
import { PayslipPDFService } from "../../adapters/service/PayslipPDFService";
import { PayslipController } from "../controllers/PDFHandlerController";
import { CronService } from "../../adapters/service/CronService";

export class ControllerRegistry {
    static registerControllers() : void {
        container.register("AdminController", {
            useClass : AdminController,
        });

        container.register("RefreshController" , {
            useClass : RefreshController,
        });

        container.register("AdminUserManagement",{
            useClass : AdminUserManagement,
        });
        
        container.register("EmployeeController", {
            useClass : EmployeeController,
        });
        
        container.register("IEmployeeProfile", {
            useClass : EmployeeProfile,
        });

        container.register("ILeaveTypeController", {
            useClass : LeaveTypeController,
        });

        container.register("LeaveBalanceController",{
            useClass : LeaveBalanceController,
        });

        container.register("LeaveRequestController",{
            useClass : LeaveRequestController,
        });

        container.register("ForgotPasswordController",{
            useClass : ForgotPasswordController,
        });

        container.register("ResetPasswordController" , {
            useClass : ResetPasswordController,
        });

        container.register("MeetingController",{
            useClass : MeetingController
        });

        container.register("FaqController",{
            useClass : FaqController
        });

        container.register("MessageController",{
            useClass : MessageController
        });


        container.register("GroupController",{
            useClass : GroupController,
        });
        container.register("QuestionController",{
            useClass : QuestionController,
        });

        container.register("MonthlySummaryController",{
            useClass : MonthlySummaryController,
        });

        container.register("PayrollController",{
            useClass : PayrollController,
        });

        container.register("PayslipPDFService",{
            useClass : PayslipPDFService,
        });

        container.register("PayslipController",{
            useClass : PayslipController,
        });

        container.register("CronService",{
            useClass : CronService,
        });
    }
}