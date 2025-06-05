import { injectable , inject } from "tsyringe";
import { IProjectRepository } from "../../entities/repositoryInterfaces/IProject.repository";
import { IProject } from "../../entities/models/Project.entities";
import { ProjectModel } from "../../frameworks/database/models/ProjectModal";

@injectable()
export class ProjectRepository implements IProjectRepository {
    async createProject(data: IProject): Promise<IProject> {
        return await ProjectModel.create(data);
    }

    async deleteProject(projectId: string): Promise<void> {
        await ProjectModel.findByIdAndDelete(projectId);
    }

    async updateProject(projectId : string ,updatedData: Partial<IProject>): Promise<IProject | null> {  
        return ProjectModel.findByIdAndUpdate(projectId,updatedData)
    }

    async findById(projectId: string): Promise<IProject | null> {
        return ProjectModel.findById(projectId);
    }

    async findProjects(): Promise<IProject[] | []> {
        return ProjectModel.find().populate("members" , "fullName");
    }

    async getProjectsByUser(employeeId: string ): Promise<IProject[]> {
    
          const projects = await ProjectModel.find({
            $or: [
              { projectManager: employeeId },
              { members: employeeId },
            ],
          }).exec();
    
          return projects.map((project) => ({
            _id: project._id,
            projectManager: project.projectManager,
            name: project.name,
            startDate: project.startDate,
            endDate: project.endDate,
            members: project.members,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          }));
      }
}