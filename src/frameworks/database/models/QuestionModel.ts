import { Document, model, ObjectId } from "mongoose";
import { IQuestion } from "../../../entities/models/IQuestion";
import { QuestionSchema } from "../schemas/QuestionSchema";


export interface IQuestionModel extends Omit<IQuestion , "_id">, Document {
    _id : ObjectId | string;
}

export const QuestionModel = model<IQuestionModel>("Question",QuestionSchema);