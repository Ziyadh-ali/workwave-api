import { container } from "tsyringe";
import { JwtService } from "../../adapters/service/JwtService";
import { PasswordBcrypt } from "../security/password.bcrypt";
import { EmployeeLoginUseCase } from "../../useCases/employee/employeeLoginUseCase";
import { AdminAuthUseCase } from "../../useCases/admin/AdminAuthUseCase";
import { EmployeeProfileUseCase } from "../../useCases/common/EmployeeProfileUseCase";
import { EmployeeManagementUseCase } from "../../useCases/common/EmployeeManagementUseCase";
import { RefreshTokenUseCase } from "../../useCases/common/RefreshTokenUseCase";
import { LeaveTypeUseCase } from "../../useCases/LeaveTypeUseCase";
import { LeaveBalanceUseCase } from "../../useCases/LeaveBalanceUseCase";
import { LeaveRequestUseCase } from "../../useCases/LeaveRequestUseCase";
import { EmailService } from "../../adapters/service/MailerTmp";
import { ForgotPasswordUseCase } from "../../useCases/employee/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../useCases/employee/ResetPasswordUseCase";
import { AttendanceUseCase } from "../../useCases/AttendanceUseCase";
import { MeetingUseCase } from "../../useCases/MeetingUseCase";
import { FaqUseCase } from "../../useCases/FaqUseCase";
import { IAdminAuthUseCase } from "../../entities/useCaseInterface/IAdaminAuthUseCase";
import { IJwtService } from "../../entities/services/JwtInterface";
import { IBcrypt } from "../security/bcrypt.interface";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { IEmployeeManagementUseCase } from "../../entities/useCaseInterface/IEmployeeManagementUseCase";
import { IEmployeeLoginUseCase } from "../../entities/useCaseInterface/IEmployeeLoginUseCase";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterface/IRefreshTokenUseCase";
import { ILeaveTypeUseCase } from "../../entities/useCaseInterface/ILeaveTypeUseCase";
import { ILeaveBalanceUseCase } from "../../entities/useCaseInterface/ILeaveBalanceUseCase";
import { ILeaveRequestUseCase } from "../../entities/useCaseInterface/ILeaveRequestUseCase";
import { IEmailService } from "../../entities/services/IEmailService.interface";
import { IForgotPasswordUseCase } from "../../entities/useCaseInterface/IForgotPassword";
import { IResetPasswordUseCase } from "../../entities/useCaseInterface/IResetPasswordUseCase";
import { IAttendanceUseCase } from "../../entities/useCaseInterface/IAttendanceUseCase";
import { IMeetingUseCase } from "../../entities/useCaseInterface/IMeetingUseCase";
import { IFaqUseCase } from "../../entities/useCaseInterface/IFaqUseCase";
import { IMessageUseCase } from "../../entities/useCaseInterface/IMessageUseCase";
import { MessageUseCase } from "../../useCases/MessageUseCase";
import { IProjectUseCase } from "../../entities/useCaseInterface/IProjectUseCase";
import { ProjectUseCase } from "../../useCases/ProjectUseCase";
import { IGroupUseCase } from "../../entities/useCaseInterface/IGroupUseCase";
import { GroupUseCase } from "../../useCases/GroupUseCase";
import { QuestionUseCase } from "../../useCases/QuestionUseCase";
import { IQuestionUseCase } from "../../entities/useCaseInterface/IQuestionUseCase";
import { IMonthlySummaryUseCase } from "../../entities/useCaseInterface/IMonthlySummaryUseCase";
import { MonthlySummaryUseCase } from "../../useCases/MonthlySummaryUseCase";
import { IPayrollUseCase } from "../../entities/useCaseInterface/IPayrollUseCase";
import { PayrollUseCase } from "../../useCases/PayrollUseCase";


export class UseCaseRegistry {
    static registerUseCases(): void {
        container.register<IAdminAuthUseCase>("IAdminAuthUseCase", {
            useClass: AdminAuthUseCase,
        });

        container.register<IJwtService>("IJwtService", {
            useClass: JwtService,
        });

        container.register<IBcrypt>("IBcrypt", {
            useClass: PasswordBcrypt,
        });

        container.register<IEmployeeProfileUseCase>("IEmployeeProfileUseCase",{
            useClass : EmployeeProfileUseCase,
        });

        container.register<IEmployeeManagementUseCase>("IEmployeeManagementUseCase",{
            useClass : EmployeeManagementUseCase,
        });

        container.register<IEmployeeLoginUseCase>("IEmployeeLoginUseCase",{
            useClass : EmployeeLoginUseCase,
        });

        container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
            useClass : RefreshTokenUseCase,
        });

        container.register<ILeaveTypeUseCase>("ILeaveTypeUseCase",{
            useClass : LeaveTypeUseCase,
        });

        container.register<ILeaveBalanceUseCase>("ILeaveBalanceUseCase",{
            useClass : LeaveBalanceUseCase,
        });

        container.register<ILeaveRequestUseCase>("ILeaveRequestUseCase" ,{
            useClass : LeaveRequestUseCase,
        });

        container.register<IEmailService>("IEmailService",{
            useClass : EmailService,
        });

        container.register<IForgotPasswordUseCase>("IForgotPasswordUseCase",{
            useClass : ForgotPasswordUseCase,
        });

        container.register<IResetPasswordUseCase>("IResetPasswordUseCase",{
            useClass : ResetPasswordUseCase
        });

        container.register<IAttendanceUseCase>("IAttendanceUseCase",{
            useClass : AttendanceUseCase
        });

        container.register<IMeetingUseCase>("IMeetingUseCase",{
            useClass : MeetingUseCase,
        });

        container.register<IFaqUseCase>("IFaqUseCase",{
            useClass : FaqUseCase,
        });

        container.register<IMessageUseCase>("IMessageUseCase",{
            useClass : MessageUseCase,
        });

        container.register<IProjectUseCase>("IProjectUseCase",{
            useClass : ProjectUseCase,
        });

        container.register<IGroupUseCase>("IGroupUseCase",{
            useClass : GroupUseCase,
        });
        container.register<IQuestionUseCase>("IQuestionUseCase",{
            useClass : QuestionUseCase,
        });

        // container.register<SocketManager>("SocketManager",{
        //     useClass : SocketManager,
        // });

        container.register<IMonthlySummaryUseCase>("IMonthlySummaryUseCase",{
            useClass : MonthlySummaryUseCase,
        });

        container.register<IPayrollUseCase>("IPayrollUseCase",{
            useClass : PayrollUseCase,
        });
    }
}