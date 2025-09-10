import { injectable , inject } from "tsyringe";
import { IFaqUseCase } from "../entities/useCaseInterface/IFaqUseCase";
import { FaqRepository } from "../adapters/repositories/FaqRepository";
import { ObjectId } from "mongoose";
import { FaqResponseDTO } from "../entities/dtos/ResponseDTOs/FaqDTO";
import { CreateFaqRequestDTO, UpdateFaqRequestDTO } from "../entities/dtos/RequestDTOs/FaqDTO";
import { FaqMapper } from "../entities/mapping/FaqMapper";

@injectable()
export class FaqUseCase implements IFaqUseCase {
    constructor(
        @inject("IFaqRepository") private faqRepository : FaqRepository,
    ){}

    async createFaq(data: CreateFaqRequestDTO): Promise<FaqResponseDTO> {
        const updatedData = FaqMapper.toEntity(data);
        const createdFaq = await this.faqRepository.createFaq(updatedData);
        return FaqMapper.toResponseDTO(createdFaq);
    }

    async deleteFaq(faqId: string | ObjectId): Promise<void> {
        await this.faqRepository.deleteFaq(faqId);
    }

    async find(search: string, page: number, pageSize: number): Promise<FaqResponseDTO[] | []> {
        const limit = pageSize;
        const skip = (page -1) * pageSize;

        const faqs =  await this.faqRepository.find(search , skip , limit);
        return faqs.map(FaqMapper.toResponseDTO);
    }

    async findById(faqId: string | ObjectId): Promise<FaqResponseDTO | null> {
        const faq =  await this.faqRepository.findFaqById(faqId);
        return faq ? FaqMapper.toResponseDTO(faq) : null;
    }

    async updateFaq(faqId: string | ObjectId, updatedData: UpdateFaqRequestDTO): Promise<FaqResponseDTO | null> {
        const faq =  await this.faqRepository.updateFaq(faqId , updatedData);
        return faq ? FaqMapper.toResponseDTO(faq) : null;
    }
}