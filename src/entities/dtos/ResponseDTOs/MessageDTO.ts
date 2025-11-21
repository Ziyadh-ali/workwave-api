export interface MessageResponseDTO {
  _id: string;
  content: string | null;
  sender: {
    _id: string;
    fullName?: string;
    email?: string;
    profilePic?: string;
  };
  roomId?: string | null;
  recipient?: string | null;
  media?: {
    url: string;
    type: "image" | "video" | "document";
    public_id?: string;
  } | null;
  createdAt: Date;
}
