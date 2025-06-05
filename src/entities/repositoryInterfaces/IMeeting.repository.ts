
import { IMeeting } from "../models/Meeting.entities";


export interface IMeetingRepository {
    createMeeting(meeting : IMeeting) : Promise<IMeeting>;
    getMeetingById(id : string) : Promise<IMeeting | null>;
    getMeetingsByHost(hostId : string) : Promise<IMeeting[]>;
    getMeetingsByEmployeeId(employeeId:  string | string): Promise<IMeeting[]>
    getMeetingByDate(date : Date) : Promise<IMeeting[]>;
    updateMeeting(id : string , updateData : Partial<IMeeting>) : Promise<IMeeting | null>;
    deleteMeeting(id : string) : Promise<void>;
}