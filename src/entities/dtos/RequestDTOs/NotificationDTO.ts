export interface CreateNotificationRequestDTO {
  recipient: string;
  sender?: string;
  type:
    | "message"
    | "leave_approval"
    | "leave_rejection"
    | "meeting_scheduled"
    | "meeting_updated"
    | "leave_apply";
  content: string;
  metadata?: {
    leaveId?: string;
    meetingId?: string;
    messageId?: string;
    roomId?: string;
  };
}