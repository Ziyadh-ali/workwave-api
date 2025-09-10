import { ObjectId } from "mongoose";

export interface IFaqs {
    _id?: string | ObjectId;
    topic: string;
    description: string;
    questions: {
        question: string;
        answer: string;
        createdAt?: Date;
    }[];
    createdAt?: Date;
}