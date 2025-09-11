import { MeetingResponseDTO, MeetingResponseWithParticipantsDTO } from "../dtos/ResponseDTOs/MeetingDTO";
import { IMeeting } from "../models/Meeting.entities";

export class MeetingMapper {
  static toResponseDTO(meeting: IMeeting): MeetingResponseDTO {
    return {
      _id: meeting._id?.toString() || "",
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      startTime: meeting.startTime,
      status: meeting.status,
      duration: meeting.duration,
      link: meeting.link,
      createdBy: meeting.createdBy?.toString(),
      participants: meeting.participants?.map(p => p.toString())
    };
  }

  static toResponseWithParticipantsDTO(
    meeting: any // populated meeting (mongoose document)
  ): MeetingResponseWithParticipantsDTO {
    return {
      _id: meeting._id?.toString() || "",
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      startTime: meeting.startTime,
      status: meeting.status,
      duration: meeting.duration,
      link: meeting.link,
      createdBy: meeting.createdBy
        ? {
            _id: meeting.createdBy._id?.toString(),
            fullName: meeting.createdBy.fullName,
            role: meeting.createdBy.role
          }
        : undefined,
      participants: meeting.participants?.map((p: any) => ({
        _id: p._id?.toString(),
        fullName: p.fullName,
        role: p.role
      }))
    };
  }
}