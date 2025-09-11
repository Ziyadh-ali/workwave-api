// Response DTO (basic, without participant details)
export interface MeetingResponseDTO {
  _id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  status: "upcoming" | "completed" | "ongoing";
  duration: number;
  link?: string;
  createdBy?: string;
  participants?: string[];
}

// Response DTO (with populated participant info)
export interface MeetingResponseWithParticipantsDTO {
  _id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  status: "upcoming" | "completed" | "ongoing";
  duration: number;
  link?: string;
  createdBy?: {
    _id: string;
    fullName: string;
    role: string;
  };
  participants?: {
    _id: string;
    fullName: string;
    role: string;
  }[];
}
