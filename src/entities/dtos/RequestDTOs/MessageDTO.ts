export interface MessageRequestDTO {
  content?: string;
  sender: string;
  roomId?: string;
  recipient?: string;
  media?: {
    url: string;
    type: "image" | "video" | "document";
    public_id?: string;
  };
}
