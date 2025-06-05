import { ObjectId } from "mongoose";

export interface Admin {
    _id: string | ObjectId;
    name?: string;
    email: string;
    password: string;
    role: "admin";
    createdAt?: Date;
    updatedAt?: Date;
}

