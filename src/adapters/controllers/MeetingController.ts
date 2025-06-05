import { Request, Response } from "express";
import { IMeetingUseCase } from "../../entities/useCaseInterface/IMeetingUseCase";
import { injectable, inject } from "tsyringe";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { IMeeting } from "../../entities/models/Meeting.entities";
import { CustomRequest } from "../middlewares/authMiddleware";
import { createMeetingSchema } from "../../shared/validation/validator";

@injectable()
export class MeetingController {
    constructor(
        @inject("IMeetingUseCase") private meetingUseCase: IMeetingUseCase,
    ) { }

    async createMeeting(req: Request, res: Response): Promise<void> {
        try {
            const validatedBody = createMeetingSchema.parse(req.body);

            const { meeting , filter } = validatedBody;
            const user = (req as CustomRequest).user


            const meetingWithCreator: IMeeting = {
                ...meeting,
                createdBy: user.id,
                date: new Date(),
                status : "upcoming"
            };
            const createdMeeting = await this.meetingUseCase.createMeeting(meetingWithCreator, filter);

            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.METING_SCHEDULED,
                createdMeeting,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async getMeetingByEmployeeId(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;
            const meetings = await this.meetingUseCase.getMeetingByEmployeeId(employeeId);
            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.METING_SCHEDULED,
                meetings,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async updateMeetingStatusAnsLink(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            const { link, status } = req.body;
            const updateData: { link?: string, status?: "completed" | "upcoming" | "ongoing" } = {};

            if (link) {
                updateData.link = link;
            }

            if (status && ["completed", "upcoming", "ongoing"].includes(status)) {
                updateData.status = status;
            } else if (status) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: MESSAGES.ERROR.MEETING.INVALID_STATUS,
                });
            }

            if (Object.keys(updateData).length === 0) {
                res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                    message: MESSAGES.ERROR.MEETING.MISSING_FIELDS,
                });
            }

            const meeting = await this.meetingUseCase.updateMeeting(meetingId, updateData);

            const successMessage =
                link ? MESSAGES.SUCCESS.LINK_ADDED :
                    status === "completed" ? MESSAGES.SUCCESS.MEETING_COMPLETED :
                        MESSAGES.SUCCESS.MEETING_COMPLETED;

            res.status(HTTP_STATUS_CODES.OK).json({
                message: successMessage,
                meeting,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }

    async updateMeeting(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as CustomRequest).user;
            const { meeting, filter } = req.body;
            meeting.createdBy = user.id;

            const updatedMeeting = await this.meetingUseCase.editMeeting(meeting, filter);

            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.MEETING_UPDATED,
                updatedMeeting,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }



    async deleteMeeting(req: Request, res: Response): Promise<void> {
        try {
            const { meetingId } = req.params;
            await this.meetingUseCase.deleteMeeting(meetingId);
            res.status(HTTP_STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.MEETING_DELETED,
            });
        } catch (error) {
            console.log(error);
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                message: (error instanceof Error) ? error.message : MESSAGES.ERROR.GENERIC,
            });
        }
    }
}