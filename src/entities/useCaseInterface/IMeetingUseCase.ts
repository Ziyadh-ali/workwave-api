import { ObjectId } from "mongoose";
import { IMeeting } from "../models/Meeting.entities";


export interface IMeetingUseCase {
    createMeeting(meeting : IMeeting , filter : {role ?: string , department ?: string}) : Promise<IMeeting>;
    getMeetingById(id : string) : Promise<IMeeting | null>;
    getMeetingsByHost(hostId : string) : Promise<IMeeting[]>;
    getMeetingByEmployeeId (employeeId : string | string) : Promise<IMeeting[]>;
    getMeetingByDate(date : Date) : Promise<IMeeting[]>;
    updateMeeting(id : string , updateData : Partial<IMeeting>) : Promise<IMeeting | null>;
    deleteMeeting(id : string) : Promise<void>; 
    editMeeting(meeting: IMeeting, filter: { role?: string; department?: string }): Promise<IMeeting | null>;
}