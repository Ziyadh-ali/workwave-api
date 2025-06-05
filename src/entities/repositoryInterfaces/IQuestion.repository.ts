import { IQuestion } from "../models/IQuestion";

export interface IQuestionRepository {
    create(question: Partial<IQuestion>): Promise<IQuestion>;
    findUnanswered(): Promise<IQuestion[]>;
    findAll(): Promise<IQuestion[]>;
    answerQuestion(id: string, answer: string, answeredBy: string): Promise<IQuestion | null>;
    delete(id: string): Promise<void>;
    findByEmployeeId(employeeId : string) : Promise<IQuestion[] | null>;
}