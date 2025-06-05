import { injectable , inject } from "tsyringe";
import { IProjectUseCase } from "../entities/useCaseInterface/IProjectUseCase";
import { MESSAGES } from "../shared/constants";
import { IProjectRepository } from "../entities/repositoryInterfaces/IProject.repository";
import { IProject } from "../entities/models/Project.entities";

@injectable()
export class ProjectUseCase implements IProjectUseCase {
    constructor(
        @inject("IProjectRepository") private projectRepository : IProjectRepository,
    ){}

    async createProject(data: IProject): Promise<IProject> {
        return await this.projectRepository.createProject(data);
    }

    async findById(projectId: string): Promise<IProject | null> {
        return await this.projectRepository.findById(projectId);
    }

    async deleteProject(projectId: string): Promise<void> {
        await this.projectRepository.deleteProject(projectId);
    }

    async findProjects(): Promise<IProject[] | []> {
        return await this.projectRepository.findProjects();
    }

    async updateProject(projectId: string, updatedData: Partial<IProject>): Promise<IProject | null> {
        return await this.projectRepository.updateProject(projectId,updatedData);
    }
}
