import { ObjectId } from "mongoose";

export interface Admin {
    _id: ObjectId | string;
    name?: string;
    email: string;
    password: string;
    role: "admin";
    createdAt?: Date;
    updatedAt?: Date;
}