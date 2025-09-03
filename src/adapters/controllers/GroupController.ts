import { Request, Response } from "express";
import { IGroupUseCase } from "../../entities/useCaseInterface/IGroupUseCase";
import { injectable, inject } from "tsyringe";
import { CustomRequest } from "../middlewares/AuthMiddleware";
import { HTTP_STATUS_CODES } from "../../shared/constants";

@injectable()
export class GroupController {
    constructor(
        @inject("IGroupUseCase") private groupUseCase: IGroupUseCase,
    ) { }

    async createGroup(req: Request, res: Response): Promise<void> {
        const { name, members } = req.body.data;
        const createdBy = (req as CustomRequest).user.id;
        members.push(createdBy)
        console.log(members)

        if (!name || !members || members.length === 0) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Group name and members are required." });
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
    }

    async getGroupsByUser(req: Request, res: Response): Promise<void> {
        const employeeId = (req as CustomRequest).user.id;

        const groups = await this.groupUseCase.getGroupsByUser(employeeId);

        res.status(HTTP_STATUS_CODES.OK).json(groups);
    }

    async addMembers(req: Request, res: Response): Promise<void> {
        const { groupId } = req.params;
        const { userIds } = req.body;

        const group = await this.groupUseCase.addMembers(groupId, userIds);

        res.json({
            message: 'Members added successfully',
            group
        });
    }
}