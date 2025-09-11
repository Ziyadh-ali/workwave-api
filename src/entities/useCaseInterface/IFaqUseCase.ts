import { ObjectId } from "mongoose";
import { CreateFaqRequestDTO, UpdateFaqRequestDTO } from "../dtos/RequestDTOs/FaqDTO";
import { FaqResponseDTO } from "../dtos/ResponseDTOs/FaqDTO";

export interface IFaqUseCase {
    createFaq(data: CreateFaqRequestDTO): Promise<FaqResponseDTO>;
    updateFaq(faqId: string | ObjectId, updatedData: UpdateFaqRequestDTO): Promise<FaqResponseDTO | null>;
    find(
        search: string,
        page: number,
        pageSize: number,
    ): Promise<FaqResponseDTO[] | []>;
    findById(faqId: string | ObjectId): Promise<FaqResponseDTO | null>;
    deleteFaq(faqId: string | ObjectId): Promise<void>;
    getAllFaqs(): Promise<FaqResponseDTO[] | []>;
}