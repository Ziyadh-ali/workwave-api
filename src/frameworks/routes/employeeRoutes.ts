import express, { NextFunction, Request, Response } from "express";
import {
    employeeController,
    employeeProfile,
    refreshController,
    leaveBalanceController,
    leaveRequestController,
    leaveTypeController,
    forgotPasswordController,
    resetPasswordController,
    attendanceController,
    meetingController,
    faqController,
    adminUserManagement,
    messageController,
    projectController,
    groupController,
    questionController,
    monthlySummaryController,
    payrollController,
    pdfController
} from "../di/resolver";
import { verifyAuth } from "../../adapters/middlewares/AuthMiddleware";
import upload from "../../adapters/service/Multer";
import { chatMediaUpload } from "../../adapters/service/ChatUploadMulter";
import { uploadEmployeeProfile } from "../../adapters/service/DeletePreviousTmp";
import asyncHandler from "express-async-handler"


export class UserRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router()
        this.setRoutes();
    }

    private setRoutes(): void {
        this.router.post(
            "/login",
            asyncHandler((req: Request, res: Response) => employeeController.login(req, res),)
        );

        this.router.post(
            "/logout",
            asyncHandler((req: Request, res: Response) => employeeController.logout(req, res),)
        );
        this.router.post(
            '/refresh-token/:role',
            (req: Request, res: Response) => refreshController.refreshToken(req, res)
        );
        this.router.post(
            "/forgot-password",
            asyncHandler((req: Request, res: Response) => forgotPasswordController.execute(req, res))
        )
        this.router.post(
            "/reset-password",
            asyncHandler((req: Request, res: Response) => resetPasswordController.execute(req, res),)
        )
        this.router.get(
            "/employees",
            asyncHandler((req: Request, res: Response) => adminUserManagement.getEmployeesForChat(req, res),)
        )

        this.router
            .post(
                '/users',
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => adminUserManagement.addUser(req, res))
            )
            .get(
                "/users",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => adminUserManagement.getUsers(req, res))
            )
            .get(
                "/users/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => adminUserManagement.getUserDetails(req, res))
            )
            .patch(
                "/users/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => adminUserManagement.updateprofile(req, res))
            )
            .delete(
                "/users/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => adminUserManagement.deleteUser(req, res))
            );

        this.router
            .get(
                "/profile/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => employeeProfile.getProfileDetails(req, res),)
            )
            .patch(
                "/profile/:employeeId",
                verifyAuth("employee"),
                uploadEmployeeProfile,
                upload.single("profilePic"),
                asyncHandler((req: Request, res: Response) => employeeProfile.updateprofile(req, res),)
            )
            .patch(
                "/profile/:employeeId/password",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => employeeProfile.changePassword(req, res),)
            );
        this.router
            .get(
                "/leave/balance/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveBalanceController.getLeaveBalanceById(req, res))
            )

        this.router
            .post(
                "/leave/request",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveRequestController.createLeaveRequest(req, res),)
            )

            .get(
                "/leave/request/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveRequestController.getLeaveRequestsByEmployee(req, res),)
            )

            .delete(
                "/leave/request/:leaveRequestId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveRequestController.cancelLeaveRequest(req, res))
            )
            .patch(
                "/leave/request/cancel/:leaveRequestId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveRequestController.cancelLeaveRequest(req, res))
            )

            .get(
                "/leave/requests",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveRequestController.getAllLeaveRequests(req, res))
            )

            .patch(
                "/leave/requests/:leaveRequestId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveRequestController.updateLeaveRequestStatus(req, res))
            )

        this.router
            .get(
                "/leave/types",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveTypeController.getAllLeaveTypes(req, res))
            )
            .get(
                "/leave/types/request",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => leaveTypeController.getEveryLeaveType(req, res))
            )

        this.router
            .post(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => attendanceController.checkIn(req, res))
            )
            .post(
                "/attendance/:attendanceId/regularized",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => attendanceController.requestRegularization(req, res))
            )
            .patch(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => attendanceController.checkOut(req, res))
            )
            .get(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => attendanceController.getTodayAttendance(req, res))
            )
            .get(
                "/attendance/month/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => attendanceController.getAttendanceByMonth(req, res))
            )

        this.router
            .post(
                "/meeting",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => meetingController.createMeeting(req, res))
            )
            .get(
                "/meeting/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => meetingController.getMeetingByEmployeeId(req, res))
            )
            .patch(
                "/meeting/:meetingId/link",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => meetingController.updateMeetingStatusAnsLink(req, res))
            )
            .patch(
                "/meeting/:meetingId/status",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => meetingController.updateMeetingStatusAnsLink(req, res))
            )
            .patch(
                "/meeting/:meetingId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => meetingController.updateMeeting(req, res))
            )
            .delete(
                "/meeting/:meetingId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => meetingController.deleteMeeting(req, res))
            )

        this.router
            .post(
                "/faq",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => faqController.createFaq(req, res))
            )
            .get(
                "/faq",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => faqController.getFaqs(req, res))
            )
            .patch(
                "/faq/:faqId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => faqController.updateFaq(req, res))
            )
            .delete(
                "/faq/:faqId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => faqController.deleteFaq(req, res))
            )


        this.router
            .get(
                "/messages",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => messageController.getPrivateMessages(req, res))
            )
        this.router
            .get(
                "/messages/:roomId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => messageController.getGroupMessages(req, res))
            )
        this.router
            .get(
                "/developers",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => adminUserManagement.getDevelopers(req, res))
            )

        this.router
            .post(
                "/groups",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => groupController.createGroup(req, res),)
            )
            .get(
                "/groups",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => groupController.getGroupsByUser(req, res),)
            )
            .patch(
                "/groups/:groupId/members",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => groupController.addMembers(req, res),)
            )

        this.router
            .post(
                "/question",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => questionController.submitQuestion(req, res),)
            )
            .get(
                "/question",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => questionController.getAllQuestions(req, res),)
            )
            .get(
                "/question/unanswered",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => questionController.getUnansweredQuestions(req, res),)
            )
            .get(
                "/question/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => questionController.getQuestionsByEmployeeId(req, res),)
            )
            .delete(
                "/question/:id",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => questionController.deleteQuestion(req, res),)
            )
            .patch(
                "/question/:id",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => questionController.answerQuestion(req, res),)
            )

        this.router
            .post(
                "/chat/upload",
                verifyAuth("employee"),
                chatMediaUpload.single("file"),
                asyncHandler((req: Request, res: Response) => messageController.uploadMedia(req, res),)
            )

        this.router
            .post(
                "/summary",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => monthlySummaryController.generateSummary(req, res),)
            )
            .post(
                "/summary/regenerate",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => monthlySummaryController.regenerateSummary(req, res),)
            )
            .get(
                "/summary",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => monthlySummaryController.getSummaries(req, res),)
            )

        this.router
            .get(
                "/payslip/:employeeId",
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => payrollController.getPayslipByEmployeeId(req, res),)
            )

        this.router
            .get(
                '/payslip/download/pdf',
                verifyAuth("employee"),
                asyncHandler((req: Request, res: Response) => pdfController.downloadPayslip(req, res),)
            )
    }

    public getRoute(): express.Router {
        return this.router;
    }
}