import { ObjectId } from "mongoose";

export interface INotification {
    _id: string | ObjectId;
    recipient: string | ObjectId;
    sender?: string | ObjectId;
    type: 'message' | 'leave_approval' | 'leave_rejection' | 'meeting_scheduled' | 'meeting_updated' | 'leave_apply';
    content: string;
    read?: boolean;
    createdAt: Date;
    updatedAt: Date;
    metadata?: {
        leaveId?: string;
        meetingId?: string;
        messageId?: string;
        roomId ?: string;
    };
}