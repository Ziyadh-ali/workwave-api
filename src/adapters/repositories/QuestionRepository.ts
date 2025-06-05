import { injectable, inject } from "tsyringe";
import { IQuestionRepository } from "../../entities/repositoryInterfaces/IQuestion.repository";
import { QuestionModel } from "../../frameworks/database/models/QuestionModel";
import { IQuestion } from "../../entities/models/IQuestion";

@injectable()
export class QuestionRepository implements IQuestionRepository {
    async create(question: Partial<IQuestion>): Promise<IQuestion> {
        const created = new QuestionModel(question);
        return await created.save();
    }

    async findUnanswered(): Promise<IQuestion[]> {
        return await QuestionModel.find({ isAnswered: false }).populate("employeeId");
    }

    async findAll(): Promise<IQuestion[]> {
        return await QuestionModel.find().populate("employeeId");
    }

    async answerQuestion(id: string, answer: string, answeredBy: string): Promise<IQuestion | null> {
        return await QuestionModel.findByIdAndUpdate(
            id,
            {
                answer,
                isAnswered: true,
                answeredBy,
                answeredAt: new Date(),
            },
            { new: true }
        );
    }

    async delete(id: string): Promise<void> {
        await QuestionModel.findByIdAndDelete(id);
    }

    async findByEmployeeId(employeeId: string): Promise<IQuestion[] | null> {
        return await QuestionModel.find({employeeId});
    }
}