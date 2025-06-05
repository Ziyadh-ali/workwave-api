import { inject, injectable } from "tsyringe";
import { IQuestionRepository } from "../entities/repositoryInterfaces/IQuestion.repository";
import { IQuestion } from "../entities/models/IQuestion";
import { IQuestionUseCase } from "../entities/useCaseInterface/IQuestionUseCase";

@injectable()
export class QuestionUseCase implements IQuestionUseCase {
    constructor(
        @inject("IQuestionRepository") private questionRepo: IQuestionRepository,
    ) { }

    async submitQuestion(data: Partial<IQuestion>): Promise<IQuestion> {
        return await this.questionRepo.create(data);
    }

    async getAllQuestions(): Promise<IQuestion[]> {
        return await this.questionRepo.findAll();
    }

    async getUnansweredQuestions(): Promise<IQuestion[]> {
        return await this.questionRepo.findUnanswered();
    }

    async answerQuestion(id: string, answer: string, answeredBy: string): Promise<IQuestion | null> {
        return await this.questionRepo.answerQuestion(id, answer, answeredBy);
    }

    async deleteQuestion(id: string): Promise<void> {
        await this.questionRepo.delete(id);
    }

    async findByEmployeeId(employeeId: string): Promise<IQuestion[] | null> {
        return await this.questionRepo.findByEmployeeId(employeeId);
    }
}