import { injectable } from "tsyringe";
import { IMeetingRepository } from "../../entities/repositoryInterfaces/IMeeting.repository";
import { IMeeting } from "../../entities/models/Meeting.entities";
import { IMeetingModel, meetingModel } from "../../frameworks/database/models/MeetingModel";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class MeetingRepository extends BaseRepository<IMeetingModel> implements IMeetingRepository {
    constructor() {
        super(meetingModel)
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