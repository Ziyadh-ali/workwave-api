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
        @inject("IFaqRepository") private _faqRepository : FaqRepository,
    ){}

    async createFaq(data: CreateFaqRequestDTO): Promise<FaqResponseDTO> {
        const updatedData = FaqMapper.toEntity(data);
        const createdFaq = await this._faqRepository.create(updatedData);
        return FaqMapper.toResponseDTO(createdFaq);
    }

    async deleteFaq(faqId: string | ObjectId): Promise<void> {
        await this._faqRepository.delete(faqId.toString());
    }

    async find(search: string, page: number, pageSize: number): Promise<FaqResponseDTO[] | []> {
        const limit = pageSize;
        const skip = (page -1) * pageSize;

        const faqs =  await this._faqRepository.find(search , skip , limit);
        return faqs.map(FaqMapper.toResponseDTO);
    }

    async findById(faqId: string | ObjectId): Promise<FaqResponseDTO | null> {
        const faq =  await this._faqRepository.findById(faqId.toString());
        return faq ? FaqMapper.toResponseDTO(faq) : null;
    }

    async updateFaq(faqId: string | ObjectId, updatedData: UpdateFaqRequestDTO): Promise<FaqResponseDTO | null> {
        const faq =  await this._faqRepository.update(faqId.toString() , updatedData);
        return faq ? FaqMapper.toResponseDTO(faq) : null;
    }
    async getAllFaqs(): Promise<FaqResponseDTO[] | []> {
        const faqs =  await this._faqRepository.getAll();
        return faqs.map(FaqMapper.toResponseDTO);
    }
}