export interface NotificationResponseDTO {
  _id: string;
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
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    leaveId?: string;
    meetingId?: string;
    messageId?: string;
    roomId?: string;
  };
}

export interface NotificationWithUsersResponseDTO {
  _id: string;
  recipient: {
    _id: string;
    fullName: string;
    role: "admin" | "employee";
  };
  sender?: {
    _id: string;
    fullName: string;
    role: "admin" | "employee";
  };
  type:
    | "message"
    | "leave_approval"
    | "leave_rejection"
    | "meeting_scheduled"
    | "meeting_updated"
    | "leave_apply";
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    leaveId?: string;
    meetingId?: string;
    messageId?: string;
    roomId?: string;
  };
}