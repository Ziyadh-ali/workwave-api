import { IProject } from "../models/Project.entities";

export interface IProjectRepository {
    createProject(data : IProject) : Promise<IProject>;
    updateProject(projectId : string,updatedData : Partial<IProject>) : Promise<IProject | null>;
    deleteProject(projectId : string) : Promise<void>;
    findById(projectId : string) : Promise<IProject | null>;
    findProjects () : Promise<IProject[] | []>;
    getProjectsByUser(employeeId: string ): Promise<IProject[]>
}