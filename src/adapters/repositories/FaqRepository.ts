import { injectable } from "tsyringe";
import { IFaqRepository } from "../../entities/repositoryInterfaces/IFaq.respository";
import { IFaqs } from "../../entities/models/IFaqs";
import { FaqModel } from "../database/models/FaqModel";
import { BaseRepository } from "./BaseRepository";
import { IFaqModel } from '../database/models/FaqModel';

@injectable()
export class FaqRepository extends BaseRepository<IFaqModel> implements IFaqRepository {
    constructor() {
        super(FaqModel)
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
}