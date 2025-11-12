import { Document, model, ObjectId } from "mongoose";
import { MessageSchema } from "../schemas/MessageSchema";
import { IMessage } from "../../../entities/models/IMessage.enities";
import { MonthlyAttendanceSummarySchema } from "../schemas/MonthlyAttendanceSummarySchema";
import { IMonthlyAttendanceSummary } from "../../../entities/models/IMonthlyAttendanceSummary";


export interface IMonthlyAttendanceSummaryModel extends Omit<IMonthlyAttendanceSummary , "_id">, Document {
    _id : ObjectId;
}

export const MonthlySummaryModel = model<IMonthlyAttendanceSummaryModel>("MonthlySummary",MonthlyAttendanceSummarySchema);