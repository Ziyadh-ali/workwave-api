import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { MESSAGES } from "../../shared/constants";
import { IQuestionUseCase } from "../../entities/useCaseInterface/IQuestionUseCase";
import { CustomRequest } from "../middlewares/authMiddleware";

@injectable()
export class QuestionController {
    constructor(
        @inject("IQuestionUseCase") private questionUseCase: IQuestionUseCase,
    ) { }

    async submitQuestion(req: Request, res: Response): Promise<void> {
        try {
            const { question } = req.body;
            const employeeId = (req as CustomRequest).user.id;

            if (!question || !employeeId) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Question and employee ID are required" });
            }

            const result = await this.questionUseCase.submitQuestion({
                employeeId,
                question,
            });

            res.status(HTTP_STATUS_CODES.OK).json(result);
        } catch (err) {
            console.error(err);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to submit question" });
        }
    }

    async getAllQuestions(_req: Request, res: Response): Promise<void> {
        try {
            const questions = await this.questionUseCase.getAllQuestions();
            res.status(HTTP_STATUS_CODES.OK).json({questions});
        } catch (err) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch questions" });
        }
    }

    async getUnansweredQuestions(_req: Request, res: Response): Promise<void> {
        try {
            const questions = await this.questionUseCase.getUnansweredQuestions();
            res.status(HTTP_STATUS_CODES.OK).json(questions);
        } catch (err) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch unanswered questions" });
        }
    }

    async answerQuestion(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { answer } = req.body;
            const answeredBy = (req as CustomRequest).user.fullName || "Admin";

            if (!answer) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Answer is required" });
            }

            const updated = await this.questionUseCase.answerQuestion(id, answer, answeredBy);

            if (!updated) res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Question not found" });

            res.status(HTTP_STATUS_CODES.OK).json({
                updated,
                message : "Answer Provided"
            });
        } catch (err) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to answer question" });
        }
    }

    async deleteQuestion(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.questionUseCase.deleteQuestion(id);
            res.status(HTTP_STATUS_CODES.OK).json({ message: "Question deleted" });
        } catch (err) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete question" });
        }
    }

    async getQuestionsByEmployeeId(req: Request , res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const questions = await this.questionUseCase.findByEmployeeId(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({ questions });
        } catch (err) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch question" });
        }
    }

    
}