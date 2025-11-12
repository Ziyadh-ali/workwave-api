import { injectable } from "tsyringe";
import { IQuestionRepository } from "../../entities/repositoryInterfaces/IQuestion.repository";
import { IQuestionModel, QuestionModel } from "../database/models/QuestionModel";
import { IQuestion } from "../../entities/models/IQuestion";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class QuestionRepository extends BaseRepository<IQuestionModel> implements IQuestionRepository {
    constructor(){
        super(QuestionModel);
    }

    async findUnanswered(): Promise<IQuestion[]> {
        return await QuestionModel.find({ isAnswered: false }).populate("employeeId");
    }

    async findAllQuestions(): Promise<IQuestion[]> {
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

    async findByEmployeeId(employeeId: string): Promise<IQuestion[] | null> {
        return await QuestionModel.find({employeeId});
    }
}