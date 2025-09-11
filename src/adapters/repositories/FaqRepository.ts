import { injectable, inject } from "tsyringe";
import { IFaqRepository } from "../../entities/repositoryInterfaces/IFaq.respository";
import { IFaqs } from "../../entities/models/IFaqs";
import { FaqModel } from "../../frameworks/database/models/FaqModel";
import { ObjectId } from "mongoose";

@injectable()
export class FaqRepository implements IFaqRepository {
    async createFaq(data: IFaqs): Promise<IFaqs> {
        return await FaqModel.create(data);
    }

    async deleteFaq(faqId: string | ObjectId): Promise<void> {
        await FaqModel.findByIdAndDelete(faqId);
    }

    async find(search: string, skip: number, limit: number): Promise<IFaqs[] | []> {
        const regex = new RegExp(search, "i");

        const faqs = await FaqModel.find({
            $or: [
                { topic: regex },
                { description: regex },
                { "questions.question": regex },
                { "questions.answer": regex },
            ],
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return faqs;
    }

    async findFaqById(faqId: string | ObjectId): Promise<IFaqs | null> {
        return await FaqModel.findById(faqId);
    }

    async updateFaq(faqId: string | ObjectId, updatedData: Partial<IFaqs>): Promise<IFaqs | null> {
        return await FaqModel.findByIdAndUpdate(faqId, updatedData, { new: true });
    }

    async getAllFaqs(): Promise<IFaqs[] | []> {
        return await FaqModel.find().sort({ createdAt: -1 });
    }
}