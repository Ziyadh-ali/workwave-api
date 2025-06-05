import { ObjectId } from "mongoose";

export interface IHoliday {
    _id?: string | ObjectId;
    name: string;
    date: Date;
    description?: string;
}