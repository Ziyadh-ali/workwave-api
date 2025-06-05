import { Document, model, ObjectId } from "mongoose";
import { IMeeting } from "../../../entities/models/Meeting.entities";
import { MeetingSchema } from "../schemas/MeetingSchema";


export interface IMeetingModel extends Omit<IMeeting , "_id">, Document {
    _id : ObjectId;
}

export const meetingModel = model<IMeetingModel>("Meeting",MeetingSchema);