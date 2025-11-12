
import { IMeetingModel } from "../../adapters/database/models/MeetingModel";
import { IMeeting } from "../models/Meeting.entities";
import { IBaseRepository } from "./IBase.repository";


export interface IMeetingRepository extends IBaseRepository<IMeetingModel> {
    getMeetingsByHost(hostId : string) : Promise<IMeeting[]>;
    getMeetingsByEmployeeId(employeeId:  string | string): Promise<IMeeting[]>
    getMeetingByDate(date : Date) : Promise<IMeeting[]>;
}