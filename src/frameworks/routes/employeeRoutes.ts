import express, { Request, Response } from "express";
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
import { verifyAuth } from "../../adapters/middlewares/authMiddleware";
import upload from "../../adapters/service/multer";
import { chatMediaUpload } from "../../adapters/service/chatUploadMulter";


export class UserRoute {
    private router: express.Router;

    constructor() {
        this.router = express.Router()
        this.setRoutes();
    }

    private setRoutes(): void {
        this.router.post(
            "/login",
            (req: Request, res: Response) => employeeController.login(req, res),
        );

        this.router.post(
            "/logout",
            (req: Request, res: Response) => employeeController.logout(req, res),
        );
        this.router.post(
            '/refresh-token/:role',
            (req: Request, res: Response) => refreshController.refreshToken(req, res)
        );
        this.router.post(
            "/forgot-password",
            (req: Request, res: Response) => forgotPasswordController.execute(req, res)
        )
        this.router.post(
            "/reset-password",
            (req: Request, res: Response) => resetPasswordController.execute(req, res),
        )
        this.router.get(
            "/employees",
            (req: Request, res: Response) => adminUserManagement.getEmployeesForChat(req, res),
        )

        this.router
            .get(
                "/profile/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => employeeProfile.getProfileDetails(req, res),
            )
            .patch(
                "/profile/:employeeId",
                verifyAuth("employee"),
                upload.single("profilePic"),
                (req: Request, res: Response) => employeeProfile.updateprofile(req, res),
            )
            .patch(
                "/profile/:employeeId/password",
                verifyAuth("employee"),
                (req: Request, res: Response) => employeeProfile.changePassword(req, res),
            );
        this.router
            .get(
                "/leave/balance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveBalanceController.getLeaveBalanceById(req, res)
            )

        this.router
            .post(
                "/leave/request",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.createLeaveRequest(req, res),
            )

            .get(
                "/leave/request/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.getLeaveRequestsByEmployee(req, res),
            )

            .delete(
                "/leave/request/:leaveRequestId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.cancelLeaveRequest(req, res)
            )
            .patch(
                "/leave/request/cancel/:leaveRequestId",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveRequestController.cancelLeaveRequest(req, res)
            )

        this.router
            .get(
                "/leave/types",
                verifyAuth("employee"),
                (req: Request, res: Response) => leaveTypeController.getAllLeaveTypes(req, res)
            )

        this.router
            .post(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.checkIn(req, res)
            )
            .post(
                "/attendance/:attendanceId/regularized",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.requestRegularization(req, res)
            )
            .patch(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.checkOut(req, res)
            )
            .get(
                "/attendance/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.getTodayAttendance(req, res)
            )
            .get(
                "/attendance/month/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => attendanceController.getAttendanceByMonth(req, res)
            )

        this.router
            .post(
                "/meeting",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.createMeeting(req, res)
            )
            .get(
                "/meeting/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.getMeetingByEmployeeId(req, res)
            )
            .patch(
                "/meeting/:meetingId/link",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.updateMeetingStatusAnsLink(req, res)
            )
            .patch(
                "/meeting/:meetingId/status",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.updateMeetingStatusAnsLink(req, res)
            )
            .patch(
                "/meeting/:meetingId",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.updateMeeting(req, res)
            )
            .delete(
                "/meeting/:meetingId",
                verifyAuth("employee"),
                (req: Request, res: Response) => meetingController.deleteMeeting(req, res)
            )

        this.router
            .post(
                "/faq",
                verifyAuth("employee"),
                (req: Request, res: Response) => faqController.createFaq(req, res)
            )
            .get(
                "/faq",
                verifyAuth("employee"),
                (req: Request, res: Response) => faqController.getFaqs(req, res)
            )
            .patch(
                "/faq/:faqId",
                verifyAuth("employee"),
                (req: Request, res: Response) => faqController.updateFaq(req, res)
            )
            .delete(
                "/faq/:faqId",
                verifyAuth("employee"),
                (req: Request, res: Response) => faqController.deleteFaq(req, res)
            )

        this.router
            .get(
                "/projects",
                verifyAuth("employee"),
                (req: Request, res: Response) => projectController.findProjects(req, res)
            )
            .post(
                "/projects",
                verifyAuth("employee"),
                (req: Request, res: Response) => projectController.createProject(req, res)

            )
            .patch(
                "/projects/:projectId",
                verifyAuth("employee"),
                (req: Request, res: Response) => projectController.updateProject(req, res)
            )
            .delete(
                "/projects/:projectId",
                verifyAuth("employee"),
                (req: Request, res: Response) => projectController.deleteProject(req, res)
            )
            .get(
                "/projects/:projectId",
                verifyAuth("employee"),
                (req: Request, res: Response) => projectController.findById(req, res)
            )
        this.router
            .get(
                "/messages",
                verifyAuth("employee"),
                (req: Request, res: Response) => messageController.getPrivateMessages(req, res)
            )
        this.router
            .get(
                "/messages/:roomId",
                verifyAuth("employee"),
                (req: Request, res: Response) => messageController.getGroupMessages(req, res)
            )
        this.router
            .get(
                "/developers",
                verifyAuth("employee"),
                (req: Request, res: Response) => adminUserManagement.getDevelopers(req, res)
            )

        this.router
            .post(
                "/groups",
                verifyAuth("employee"),
                (req: Request, res: Response) => groupController.createGroup(req, res),
            )
            .get(
                "/groups",
                verifyAuth("employee"),
                (req: Request, res: Response) => groupController.getGroupsByUser(req, res),
            )
            .patch(
                "/groups/:groupId/members",
                verifyAuth("employee"),
                (req: Request, res: Response) => groupController.addMembers(req, res),
            )

        this.router
            .post(
                "/question",
                verifyAuth("employee"),
                (req: Request, res: Response) => questionController.submitQuestion(req, res),
            )
            .get(
                "/question",
                verifyAuth("employee"),
                (req: Request, res: Response) => questionController.getAllQuestions(req, res),
            )
            .get(
                "/question/unanswered",
                verifyAuth("employee"),
                (req: Request, res: Response) => questionController.getUnansweredQuestions(req, res),
            )
            .get(
                "/question/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => questionController.getQuestionsByEmployeeId(req, res),
            )
            .delete(
                "/question/:id",
                verifyAuth("employee"),
                (req: Request, res: Response) => questionController.deleteQuestion(req, res),
            )
            .patch(
                "/question/:id",
                verifyAuth("employee"),
                (req: Request, res: Response) => questionController.answerQuestion(req, res),
            )

        this.router
            .post(
                "/chat/upload",
                verifyAuth("employee"),
                chatMediaUpload.single("file"),
                (req: Request, res: Response) => messageController.uploadMedia(req, res),
            )

        this.router
            .post(
                "/summary",
                verifyAuth("employee"),
                (req: Request, res: Response) => monthlySummaryController.generateSummary(req, res),
            )
            .post(
                "/summary/regenerate",
                verifyAuth("employee"),
                (req: Request, res: Response) => monthlySummaryController.regenerateSummary(req, res),
            )
            .get(
                "/summary",
                verifyAuth("employee"),
                (req: Request, res: Response) => monthlySummaryController.getSummaries(req, res),
            )

        this.router
            .get(
                "/payslip/:employeeId",
                verifyAuth("employee"),
                (req: Request, res: Response) => payrollController.getPayslipByEmployeeId(req, res),
            )

        this.router
            .get(
                '/payslip/download/pdf',
                verifyAuth("employee"),
                (req: Request, res: Response) => pdfController.downloadPayslip(req, res),
            )
    }

    public getRoute(): express.Router {
        return this.router;
    }
}