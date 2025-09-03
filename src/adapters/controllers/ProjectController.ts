import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { inject, injectable } from "tsyringe";
import { MESSAGES } from "../../shared/constants";
import { IProjectUseCase } from "../../entities/useCaseInterface/IProjectUseCase";
import { CustomRequest } from "../middlewares/AuthMiddleware";

@injectable()
export class ProjectController {
    constructor(
        @inject("IProjectUseCase") private projectUseCase: IProjectUseCase,
    ) { }

    async createProject(req: Request, res: Response): Promise<void> {
        const projectManager = (req as CustomRequest).user.id;
        const { data } = req.body;
        console.log(projectManager)
        const newProject = await this.projectUseCase.createProject({ ...data, projectManager });

        res.status(HTTP_STATUS_CODES.OK).json({
            newProject,
            message: MESSAGES.SUCCESS.PROJECT_CREATED,
        })
    }

    async updateProject(req: Request, res: Response): Promise<void> {
        const { projectId } = req.params;
        const { updatedData } = req.body;
        const updatedProject = await this.projectUseCase.updateProject(projectId, updatedData);

        res.status(HTTP_STATUS_CODES.OK).json({
            updatedProject,
            message: MESSAGES.SUCCESS.PROJECT_UPDATED,
        })
    }

    async deleteProject(req: Request, res: Response): Promise<void> {
        const { projectId } = req.params;
        await this.projectUseCase.deleteProject(projectId);

        res.status(HTTP_STATUS_CODES.OK).json({
            message: MESSAGES.SUCCESS.PROJECT_DELETED,
        })
    }

    async findById(req: Request, res: Response): Promise<void> {
        const { projectId } = req.params;
        const project = await this.projectUseCase.findById(projectId);

        res.status(HTTP_STATUS_CODES.OK).json({
            project
        })
    }

    async findProjects(req: Request, res: Response): Promise<void> {
        const projects = await this.projectUseCase.findProjects();

        res.status(HTTP_STATUS_CODES.OK).json({
            projects
        })
    }
}