import { IFaqs } from "../models/IFaqs";
import { CreateFaqRequestDTO , UpdateFaqRequestDTO } from "../dtos/RequestDTOs/FaqDTO";
import { FaqResponseDTO } from "../dtos/ResponseDTOs/FaqDTO";

export class FaqMapper {
  static toEntity(dto: CreateFaqRequestDTO): IFaqs {
    return {
      topic: dto.topic,
      description: dto.description,
      questions: dto.questions?.map(q => ({
        question: q.question,
        answer: q.answer,
        createdAt: new Date(),
      })) || [],
      createdAt: new Date(),
    };
  }

  static toResponseDTO(entity: IFaqs): FaqResponseDTO {
    return {
      _id: entity._id!,
      topic: entity.topic,
      description: entity.description,
      questions: entity.questions.map(q => ({
        question: q.question,
        answer: q.answer,
        createdAt: q.createdAt?.toISOString(),
      })),
      createdAt: entity.createdAt?.toISOString(),
    };
  }
}