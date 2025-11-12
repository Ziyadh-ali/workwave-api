import { Schema } from "mongoose";
import { IFaqModel } from "../models/FaqModel";

export const FaqSchema = new Schema<IFaqModel>(
    {
        topic: { type: String, required: true },
        description: { type: String, required: true },
        questions: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
                createdAt: Date,
            }
        ],  
        createdAt: Date,
    }
);