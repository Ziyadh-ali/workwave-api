// Request DTO for creating a meeting
export interface CreateMeetingDTO {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  status: "upcoming" | "completed" | "ongoing";
  duration: number;
  link?: string;
  createdBy: string; // string because in API we usually pass string ids
  participants?: string[];
}

