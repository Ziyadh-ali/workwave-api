import { ObjectId } from "mongoose";
import { IMeeting } from "../models/Meeting.entities";
import { MeetingResponseDTO, MeetingResponseWithParticipantsDTO } from "../dtos/ResponseDTOs/MeetingDTO";


export interface IMeetingUseCase {
    createMeeting(meeting : IMeeting , filter : {role ?: string , department ?: string}) : Promise<MeetingResponseDTO>;
    getMeetingById(id : string) : Promise<MeetingResponseDTO | null>;
    getMeetingsByHost(hostId : string) : Promise<MeetingResponseDTO[]>;
    getMeetingByEmployeeId (employeeId : string | string) : Promise<MeetingResponseWithParticipantsDTO[]>;
    getMeetingByDate(date : Date) : Promise<MeetingResponseDTO[]>;
    updateMeeting(id : string , updateData : Partial<MeetingResponseDTO>) : Promise<MeetingResponseDTO | null>;
    deleteMeeting(id : string) : Promise<void>; 
    editMeeting(meeting: IMeeting, filter: { role?: string; department?: string }): Promise<MeetingResponseDTO | null>;
}