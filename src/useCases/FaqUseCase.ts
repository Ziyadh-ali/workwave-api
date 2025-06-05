import { injectable , inject } from "tsyringe";
import { IFaqUseCase } from "../entities/useCaseInterface/IFaqUseCase";
import { IFaqRepository } from "../entities/repositoryInterfaces/IFaq.respository";
import { FaqRepository } from "../adapters/repositories/FaqRepository";
import { IFaqs } from "../entities/models/IFaqs";
import { ObjectId } from "mongoose";

@injectable()
export class FaqUseCase implements IFaqUseCase {
    constructor(
        @inject("IFaqRepository") private faqRepository : FaqRepository,
    ){}

    async createFaq(data: IFaqs): Promise<IFaqs> {
        return await this.faqRepository.createFaq(data);
    }

    async deleteFaq(faqId: string | ObjectId): Promise<void> {
        await this.faqRepository.deleteFaq(faqId);
    }

    async find(search: string, page: number, pageSize: number): Promise<IFaqs[] | []> {
        const limit = pageSize;
        const skip = (page -1) * pageSize;

        return await this.faqRepository.find(search , skip , limit);
    }

    async findById(faqId: string | ObjectId): Promise<IFaqs | null> {
        return await this.faqRepository.findFaqById(faqId);
    }

    async updateFaq(faqId: string | ObjectId, updatedData: Partial<IFaqs>): Promise<IFaqs | null> {
        return await this.faqRepository.updateFaq(faqId , updatedData);
    }
}