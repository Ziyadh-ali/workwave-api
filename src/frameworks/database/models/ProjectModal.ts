import { Document, model, ObjectId } from "mongoose";
import { IProject } from "../../../entities/models/Project.entities";
import { ProjectSchema } from "../schemas/ProjectSchema";


export interface IProjectModel extends Omit<IProject , "_id">, Document {
    _id : ObjectId;
}

export const ProjectModel = model<IProjectModel>("Project",ProjectSchema);