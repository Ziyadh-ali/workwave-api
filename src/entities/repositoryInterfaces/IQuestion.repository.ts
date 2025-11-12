import { IQuestionModel } from "../../adapters/database/models/QuestionModel";
import { IQuestion } from "../models/IQuestion";
import { IBaseRepository } from "./IBase.repository";

export interface IQuestionRepository extends IBaseRepository<IQuestionModel> {
    findUnanswered(): Promise<IQuestion[]>;
    findAllQuestions(): Promise<IQuestion[]>;
    answerQuestion(id: string, answer: string, answeredBy: string): Promise<IQuestion | null>;
    findByEmployeeId(employeeId : string) : Promise<IQuestion[] | null>;
}