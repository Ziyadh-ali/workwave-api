import { ObjectId } from "mongoose";

export interface IProject {
    _id ?: string | ObjectId;
    projectManager ?: string | ObjectId;
    name : string;
    startDate : Date;
    endDate : Date;
    members : ObjectId[] | string[];
    createdAt ?: Date;
    updatedAt ?: Date;
}