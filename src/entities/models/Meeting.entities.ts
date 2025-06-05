import { ObjectId } from "mongoose";


export interface IMeeting {
    _id ?: ObjectId | string;
    title : string,
    description : string;
    date : Date;
    startTime: string;
    status : "upcoming" | "completed" | "ongoing";
    duration : number;
    link ?: string;
    createdBy ?: ObjectId | string;
    participants ?: ObjectId[] | string[];
}