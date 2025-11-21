import { ObjectId } from "mongoose";

export interface IMessage {
    _id?: string | ObjectId;
    content: string;
    sender: {_id : string , fullName : string , email : string , profilePic : string};
    roomId?: ObjectId | string;
    recipient?: ObjectId | string;
    media?: {
        url: string;
        type: 'image' | 'video' | 'document';
        public_id?: string;
    };
    createdAt?: Date;
}