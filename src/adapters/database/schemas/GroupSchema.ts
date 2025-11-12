import { Schema } from "mongoose";
import { IGroupModel } from "../models/GroupModel";

export const GroupSchema = new Schema<IGroupModel>(
    {
        name: { type: String, required: true },
        members: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
        createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    }
);