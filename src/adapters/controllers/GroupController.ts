import { Request, Response } from "express";
import { IGroupUseCase } from "../../entities/useCaseInterface/IGroupUseCase";
import { injectable, inject } from "tsyringe";
import { CustomRequest } from "../middlewares/authMiddleware";
import { HTTP_STATUS_CODES } from "../../shared/constants";

@injectable()
export class GroupController {
    constructor(
        @inject("IGroupUseCase") private groupUseCase: IGroupUseCase,
    ) { }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const { name, members } = req.body.data;
            const createdBy = (req as CustomRequest).user.id;
            members.push(createdBy)
            console.log(members)

            if (!name || !members || members.length === 0) {
                res.status(400).json({ message: "Group name and members are required." });
                return;
            }

            const group = await this.groupUseCase.createGroup({
                name,
                members,
                createdBy,
            });

            res.status(HTTP_STATUS_CODES.OK).json({
                group,
                message: "message created successfully"
            })

        } catch (error) {
            console.error(" Error creating group:", error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: "Failed to create group." });
        }
    }

    async getGroupsByUser(req: Request, res: Response): Promise<void> {
        try {
            const employeeId = (req as CustomRequest).user.id;

            const groups = await this.groupUseCase.getGroupsByUser(employeeId);

            res.status(HTTP_STATUS_CODES.OK).json(groups);
        } catch (error) {
            console.error("❌ Error fetching groups:", error);
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: (error instanceof Error) ? error.message : "Failed to fetch groups." });
        }
    }

    async addMembers(req: Request, res: Response): Promise<void> {
        try {
            const { groupId } = req.params;
            const { userIds } = req.body;

            const group = await this.groupUseCase.addMembers(groupId, userIds);
    
            res.json({ 
              message: 'Members added successfully',
              group
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }


}