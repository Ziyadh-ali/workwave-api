import { ObjectId } from "mongoose";

export interface IGroup {
    _id?: string | ObjectId;
    name: string;
    members: string[] | ObjectId[];
    createdBy: string | ObjectId;
}