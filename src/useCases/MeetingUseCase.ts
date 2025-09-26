import { injectable, inject } from "tsyringe";
import { IMeetingUseCase } from "../entities/useCaseInterface/IMeetingUseCase";
import { IMeeting } from "../entities/models/Meeting.entities";
import { IMeetingRepository } from "../entities/repositoryInterfaces/IMeeting.repository";
import { IEmployeeRepository } from "../entities/repositoryInterfaces/employee/EmployeeRepository";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { CustomError } from "../shared/errors/CustomError";
import { MeetingResponseDTO, MeetingResponseWithParticipantsDTO } from "../entities/dtos/ResponseDTOs/MeetingDTO";
import { MeetingMapper } from "../entities/mapping/MeetingMapper";

@injectable()
export class MeetingUseCase implements IMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepository: IMeetingRepository,
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
    ) { }

    async createMeeting(meeting: IMeeting, filter: { role?: string; department?: string }): Promise<MeetingResponseDTO> {
        if (!filter.role && !filter.department) {
            throw new CustomError(MESSAGES.ERROR.MEETING.ROLE_REQUIRED  , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const participants = await this.employeeRepository.getParticipantsByFilter(filter);

        if (!participants || participants.length === 0) {
            throw new CustomError(MESSAGES.ERROR.MEETING.EMPLOYEE_NOT_FOUND , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const validParticipants = [];
        for (const emp of participants) {
            const employee = await this.employeeRepository.findById(emp.toString());
            if (employee) {
                validParticipants.push(emp);
            }
        }

        const filteredParticipants = validParticipants.filter(
            (p) => p.toString() !== meeting?.createdBy?.toString()
        );

        const dateOnly = new Date(meeting.date);
        const [hours, minutes] = meeting.startTime.split(":").map(Number);
        const meetingStart = new Date(dateOnly);
        meetingStart.setHours(hours, minutes, 0, 0);

        const meetingEnd = new Date(meetingStart.getTime() + meeting.duration * 60000);

        const hostMeetings = await this.meetingRepository.getMeetingsByHost(
            meeting.createdBy ? meeting.createdBy.toString() : ""
        );

        const isHostOverlap = hostMeetings.some(existing => {
            const [existingHours, existingMinutes] = existing.startTime.split(":").map(Number);
            const existingStart = new Date(existing.date);
            existingStart.setHours(existingHours, existingMinutes, 0, 0);
            const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);
            return meetingStart < existingEnd && meetingEnd > existingStart;
        });

        if (isHostOverlap) {
            throw new CustomError(MESSAGES.ERROR.MEETING.ALREADY_HAVE_MEETING , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const allEmployeeMeetings = await Promise.all(
            filteredParticipants.map(p => this.meetingRepository.getMeetingsByEmployeeId(p))
        );

        const isParticipantOverlap = allEmployeeMeetings.flat().some(existing => {
            const [existingHours, existingMinutes] = existing.startTime.split(":").map(Number);
            const existingStart = new Date(existing.date);
            existingStart.setHours(existingHours, existingMinutes, 0, 0);
            const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);
            return meetingStart < existingEnd && meetingEnd > existingStart;
        });

        if (isParticipantOverlap) {
            throw new CustomError(MESSAGES.ERROR.MEETING.PARTICIPANTS_HAVE_MEETING , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        meeting.participants = filteredParticipants;
        return MeetingMapper.toResponseDTO(await this.meetingRepository.create(meeting));
    }

    async deleteMeeting(id: string): Promise<void> {
        await this.meetingRepository.delete(id);
    }

    async getMeetingByDate(date: Date): Promise<MeetingResponseDTO[]> {
        return (await (this.meetingRepository.getMeetingByDate(date))).map(MeetingMapper.toResponseDTO);
    }

    async getMeetingById(id: string): Promise<MeetingResponseDTO | null> {
        const meeting = await this.meetingRepository.findById(id);
        return meeting ? MeetingMapper.toResponseDTO(meeting) : null;
    }

    async getMeetingsByHost(hostId: string): Promise<MeetingResponseDTO[]> {
        return (await this.meetingRepository.getMeetingsByHost(hostId)).map(MeetingMapper.toResponseDTO);
    }

    async updateMeeting(id: string, updateData: Partial<IMeeting>): Promise<MeetingResponseDTO | null> {
        const meeting = await this.meetingRepository.update(id, updateData);
        return meeting ? MeetingMapper.toResponseDTO(meeting) : null;
    }

    async editMeeting(meeting: IMeeting, filter: { role?: string; department?: string }): Promise<MeetingResponseDTO |  null> {
        if (!filter.role && !filter.department) {
            throw new CustomError(MESSAGES.ERROR.MEETING.ROLE_REQUIRED , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const participants = await this.employeeRepository.getParticipantsByFilter(filter);

        if (!participants || participants.length === 0) {
            throw new CustomError(MESSAGES.ERROR.MEETING.EMPLOYEE_NOT_FOUND , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        const validParticipants = [];
        for (const emp of participants) {
            const employee = await this.employeeRepository.findById(emp.toString());
            if (employee) {
                validParticipants.push(emp);
            }
        }

        const filteredParticipants = validParticipants.filter(
            (p) => p.toString() !== meeting?.createdBy?.toString()
        );

        const dateOnly = new Date(meeting.date);
        const [hours, minutes] = meeting.startTime.split(":").map(Number);
        const meetingStart = new Date(dateOnly);
        meetingStart.setHours(hours, minutes, 0, 0);

        const meetingEnd = new Date(meetingStart.getTime() + meeting.duration * 60000);

        // ✅ Host overlap check (exclude the current meeting)
        const hostMeetings = await this.meetingRepository.getMeetingsByHost(meeting.createdBy ? meeting.createdBy.toString(): "");
        const isHostOverlap = hostMeetings.some(existing => {
            if (!existing._id || !meeting._id || existing._id.toString() === meeting._id.toString()) return false;

            const [existingHours, existingMinutes] = existing.startTime.split(":").map(Number);
            const existingStart = new Date(existing.date);
            existingStart.setHours(existingHours, existingMinutes, 0, 0);
            const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);

            return meetingStart < existingEnd && meetingEnd > existingStart;
        });

        if (isHostOverlap) {
            throw new CustomError(MESSAGES.ERROR.MEETING.ALREADY_HAVE_MEETING , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        // ✅ Participant overlap check (exclude the current meeting)
        const allEmployeeMeetings = await Promise.all(
            filteredParticipants.map(p => this.meetingRepository.getMeetingsByEmployeeId(p))
        );

        const isParticipantOverlap = allEmployeeMeetings.flat().some(existing => {
            if (!existing._id || !meeting._id ||existing._id.toString() === meeting._id.toString()) return false;

            const [existingHours, existingMinutes] = existing.startTime.split(":").map(Number);
            const existingStart = new Date(existing.date);
            existingStart.setHours(existingHours, existingMinutes, 0, 0);
            const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);

            return meetingStart < existingEnd && meetingEnd > existingStart;
        });

        if (isParticipantOverlap) {
            throw new CustomError(MESSAGES.ERROR.MEETING.PARTICIPANTS_HAVE_MEETING , HTTP_STATUS_CODES.BAD_REQUEST);
        }

        meeting.participants = filteredParticipants;

        const data =  await this.meetingRepository.update(meeting._id ? meeting._id.toString() : "", meeting);
        return MeetingMapper.toResponseDTO(data as IMeeting);
    }

    async getMeetingByEmployeeId(employeeId: string): Promise<MeetingResponseWithParticipantsDTO[]> {
        const meetings = await this.meetingRepository.getMeetingsByEmployeeId(employeeId);
        return meetings.map(MeetingMapper.toResponseWithParticipantsDTO);
    }
}