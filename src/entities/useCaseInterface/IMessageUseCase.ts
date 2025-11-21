import { MessageRequestDTO } from "../dtos/RequestDTOs/MessageDTO";
import { MessageResponseDTO } from "../dtos/ResponseDTOs/MessageDTO";

export interface IMessageUseCase {
    createMessage(data: MessageRequestDTO): Promise<MessageResponseDTO>;

    getPrivateMessages(user1: string, user2: string): Promise<MessageResponseDTO[]>;

    getGroupMessages(roomId: string): Promise<MessageResponseDTO[]>;

    createMessageWithMedia(data: MessageRequestDTO): Promise<MessageResponseDTO>;

    markAsRead(messageId: string, userId: string): Promise<void>
}