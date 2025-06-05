import { Schema } from "mongoose";
import { IMessageModel } from "../models/MessageModel";

export const MessageSchema = new Schema<IMessageModel>(
    {
        content: {
            type: String,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "ChatRoom",
            default: null,
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },
        media: {
            url: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                enum: ['image', 'video', 'document'],
                required: false,
            },
            public_id: {
                type: String,
                required: false,
            },
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);