import { Schema, Types } from "mongoose";
import { IProjectModel } from "../models/ProjectModal";

export const ProjectSchema = new Schema<IProjectModel>(
    {   
        projectManager : {
            type : Types.ObjectId,
            required : true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        members: [
          {
            type: Types.ObjectId,
            ref: 'Employee',
            required: true,
          },
        ],
      },
      {
        timestamps: true,
      }
);