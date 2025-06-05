import { ObjectId } from "mongoose";

export interface IQuestion {
    employeeId: string | ObjectId;
    question: string;
    answer?: string;
    isAnswered: boolean;
    answeredBy?: string;
    createdAt: Date;
    answeredAt?: Date;
}
