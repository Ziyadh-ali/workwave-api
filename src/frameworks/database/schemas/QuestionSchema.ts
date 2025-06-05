import { Schema, Types } from "mongoose";
import { IQuestionModel } from "../models/QuestionModel";

export const QuestionSchema = new Schema<IQuestionModel>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref :"Employee" , required: true },
        question: { type: String, required: true },
        answer: { type: String },
        isAnswered: { type: Boolean, default: false },
        answeredBy: { type: String },
        createdAt: { type: Date, default: Date.now },
        answeredAt: { type: Date },
    },
);