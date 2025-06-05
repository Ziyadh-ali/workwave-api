import { IQuestion } from "../models/IQuestion";

export interface IQuestionUseCase {
    submitQuestion(data: Partial<IQuestion>): Promise<IQuestion>;
    getAllQuestions(): Promise<IQuestion[]>;
    getUnansweredQuestions(): Promise<IQuestion[]>;
    answerQuestion(id: string, answer: string, answeredBy: string): Promise<IQuestion | null>;
    deleteQuestion(id: string): Promise<void>;
    findByEmployeeId(employeeId: string): Promise<IQuestion[] | null>
}