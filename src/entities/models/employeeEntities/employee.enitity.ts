import { ObjectId } from "mongoose";

export interface Employee {
    _id?: ObjectId | string;
    fullName : string,
    email : string;
    department : string;
    role : "hr" | "developer" | "projectManager";
    status : "active" | "inactive",
    password : string;
    phone?: number,
    address?: string,
    joinedAt?: Date ,
    manager?: string,
    profilePic?: string,
    salary : number;
    salaryType : "hourly" | "monthly";
    createdAt?: Date;
    updatedAt?: Date;
}