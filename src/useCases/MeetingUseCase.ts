import { injectable, inject } from "tsyringe";
import { IMeetingUseCase } from "../entities/useCaseInterface/IMeetingUseCase";
import { IMeeting } from "../entities/models/Meeting.entities";
import { IMeetingRepository } from "../entities/repositoryInterfaces/IMeeting.repository";
import { ObjectId } from "mongoose";
import { IEmployeeRepository } from "../entities/repositoryInterfaces/employee/EmployeeRepository";
import { HTTP_STATUS_CODES, MESSAGES } from "../shared/constants";
import { CustomError } from "../shared/errors/CustomError";

@injectable()
export class MeetingUseCase implements IMeetingUseCase {
    constructor(
        @inject("IMeetingRepository") private meetingRepository: IMeetingRepository,
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
    ) { }

    async createMeeting(meeting: IMeeting, filter: { role?: string; department?: string }): Promise<IMeeting> {
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
        return await this.meetingRepository.createMeeting(meeting);
    }

    async deleteMeeting(id: string): Promise<void> {
        await this.meetingRepository.deleteMeeting(id);
    }

    async getMeetingByDate(date: Date): Promise<IMeeting[]> {
        return this.meetingRepository.getMeetingByDate(date);
    }

    async getMeetingById(id: string): Promise<IMeeting | null> {
        return this.meetingRepository.getMeetingById(id);
    }

    async getMeetingsByHost(hostId: string): Promise<IMeeting[]> {
        return this.meetingRepository.getMeetingsByHost(hostId);
    }

    async updateMeeting(id: string, updateData: Partial<IMeeting>): Promise<IMeeting | null> {
        return this.meetingRepository.updateMeeting(id, updateData);
    }

    async editMeeting(meeting: IMeeting, filter: { role?: string; department?: string }): Promise<IMeeting |  null> {
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

        return await this.meetingRepository.updateMeeting(meeting._id ? meeting._id.toString() : "", meeting);
    }

    async getMeetingByEmployeeId(employeeId: string): Promise<IMeeting[]> {
        return this.meetingRepository.getMeetingsByEmployeeId(employeeId);
    }
}