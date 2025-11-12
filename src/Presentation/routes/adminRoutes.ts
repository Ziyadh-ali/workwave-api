import express, { Request, Response } from 'express';
import {
  adminController,
  refreshController,
  adminUserManagement,
  leaveRequestController,
  attendanceController,
  questionController,
  monthlySummaryController,
  payrollController,
  faqController,
} from '../di/resolver';
import { verifyAuth } from '../middlewares/AuthMiddleware';
import { leaveTypeController } from '../di/resolver';
import asyncHandler from "express-async-handler"

export class AdminRoute {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  private setRoutes(): void {
    this.router.post(
      '/login',
      asyncHandler((req: Request, res: Response) => adminController.login(req, res))
    );

    this.router.post(
      '/register',
      asyncHandler((req: Request, res: Response) => adminController.save(req, res))
    );

    this.router.post(
      '/logout',
      asyncHandler((req: Request, res: Response) => adminController.logout(req, res))
    );

    this.router.post(
      '/refresh-token/:role',
      (req: Request, res: Response) => refreshController.refreshToken(req, res)
    );

    this.router
      .post(
        '/users',
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => adminUserManagement.addUser(req, res))
      )
      .get(
        "/users",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => adminUserManagement.getUsers(req, res))
      )
      .get(
        "/users/:employeeId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => adminUserManagement.getUserDetails(req, res))
      )
      .patch(
        "/users/:employeeId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => adminUserManagement.updateprofile(req, res))
      )
      .delete(
        "/users/:employeeId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => adminUserManagement.deleteUser(req, res))
      );

    this.router
      .get(
        "/managers",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => adminUserManagement.getManagers(req, res))
      )

    this.router
      .get(
        "/leave/type",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveTypeController.getAllLeaveTypes(req, res)))

      .post(
        "/leave/type",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveTypeController.createLeaveType(req, res))
      )

      .get(
        "/leave/type/:id",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveTypeController.getLeaveTypeById(req, res))
      )

      .delete(
        "/leave/type/:id",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveTypeController.deleteLeaveType(req, res)))

      .patch(
        "/leave/type/:id",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveTypeController.updateLeaveType(req, res)))

    this.router
      .get(
        "/leave/requests",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveRequestController.getAllLeaveRequests(req, res))
      )
      .get(
        "/leave/requests/all",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveRequestController.getAllLeaveRequests(req, res))
      )

      .patch(
        "/leave/requests/:leaveRequestId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => leaveRequestController.updateLeaveRequestStatus(req, res))
      )

    this.router
      .get(
        "/attendance",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => attendanceController.getAllAttendanceByDate(req, res))
      )
      .patch(
        "/attendance/:attendanceId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => attendanceController.updateAttendance(req, res))
      )
      .patch(
        "/attendance/:attendanceId/regularize",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => attendanceController.respondToRegularizationRequest(req, res))
      )

    this.router
      .get(
        "/question",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => questionController.getAllQuestions(req, res),)
      )
      .get(
        "/question/unanswered",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => questionController.getUnansweredQuestions(req, res),)
      )
      .patch(
        "/question/:id",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => questionController.answerQuestion(req, res),)
      )

    this.router
      .post(
        "/summary",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => monthlySummaryController.generateSummary(req, res),)
      )
      .post(
        "/summary/regenerate",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => monthlySummaryController.regenerateSummary(req, res),)
      )
      .patch(
        "/summary/approve/:summaryId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => monthlySummaryController.approveSummary(req, res),)
      )
      .patch(
        "/summary/reject/:summaryId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => monthlySummaryController.rejectSummary(req, res),)
      )
      .patch(
        "/summary/bulk-approve",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => monthlySummaryController.bulkApproveSummaries(req, res),)
      )
      .get(
        "/summary",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => monthlySummaryController.getSummaries(req, res),)
      )

    this.router
      .post(
        "/payroll/generate",
        verifyAuth("admin"),
        asyncHandler((req, res) => payrollController.generatePayroll(req, res))
      )
      .post(
        "/payroll/generate/bulk",
        verifyAuth("admin"),
        asyncHandler((req, res) => payrollController.generateBulkPayroll(req, res))
      )

      .get(
        "/payroll",
        verifyAuth("admin"),
        asyncHandler((req, res) => payrollController.getPayrollRecords(req, res))
      )
      .get(
        "/payrolls",
        verifyAuth("admin"),
        asyncHandler((req, res) => payrollController.getAllPayroll(req, res))
      )

      .patch(
        "/payroll/:payrollId/status",
        verifyAuth("admin"),
        asyncHandler((req, res) => payrollController.updatePayrollStatus(req, res))
      )

    this.router
      .post(
        "/faq",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => faqController.createFaq(req, res))
      )
      .get(
        "/faq",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => faqController.getFaqs(req, res))
      )
      .patch(
        "/faq/:faqId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => faqController.updateFaq(req, res))
      )
      .delete(
        "/faq/:faqId",
        verifyAuth("admin"),
        asyncHandler((req: Request, res: Response) => faqController.deleteFaq(req, res))
      )


  }

  public getRouter(): express.Router {
    return this.router;
  }
}