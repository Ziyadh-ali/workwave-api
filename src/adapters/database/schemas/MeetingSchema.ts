import { Schema } from "mongoose";
import { IMeetingModel } from "../models/MeetingModel";

export const MeetingSchema = new Schema<IMeetingModel>(
    {
        title: {type : String , required : true},
        description: {type : String , required : true},
        date: {type : Date , required : true},
        startTime : {type : String , required : true},
        duration: {type : Number , required : true},
        link: String,
        status : {type : String , enum : ["upcoming" ,"ongoing", "completed"] , default : "upcoming"},
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required : true,
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Employee',
                required  : true,
            },
        ],
    }
);