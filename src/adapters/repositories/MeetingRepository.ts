import { inject, injectable } from "tsyringe";
import { IMeetingRepository } from "../../entities/repositoryInterfaces/IMeeting.repository";
import { IMeeting } from "../../entities/models/Meeting.entities";
import { meetingModel } from "../../frameworks/database/models/MeetingModel";

@injectable()
export class MeetingRepository implements IMeetingRepository {
    async createMeeting(meeting: IMeeting): Promise<IMeeting> {
        const createdMeeting = await meetingModel.create(meeting);
        return createdMeeting;
    }

    async getMeetingById(id: string): Promise<IMeeting | null> {
        return await meetingModel.findById(id);
    }

    async deleteMeeting(id: string): Promise<void> {
        await meetingModel.findByIdAndDelete(id);
    }

    async getMeetingByDate(date: Date): Promise<IMeeting[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await meetingModel.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate("participants createdBy");
    }

    async updateMeeting(id: string, updates: Partial<IMeeting>): Promise<IMeeting | null> {
        return await meetingModel.findByIdAndUpdate(id, updates, { new: true });
    }

    async getMeetingsByHost(hostId: string): Promise<IMeeting[]> {
        return await meetingModel.find({ createdBy: hostId });
    }

    async getMeetingsByEmployeeId(employeeId: string | string): Promise<IMeeting[]> {
        return await meetingModel.find({
            $or: [
                { participants: employeeId },
                { createdBy: employeeId },
            ],
        }).populate("createdBy" , "fullName , role").populate("participants" , "fullName , role");
    }
}