import { ObjectId } from "mongoose";
import { IFaqs } from "../models/IFaqs";

export interface IFaqUseCase {
    createFaq(data: IFaqs): Promise<IFaqs>;
    updateFaq(faqId: string | ObjectId, updatedData: Partial<IFaqs>): Promise<IFaqs | null>;
    find(
        search: string,
        page: number,
        pageSize: number,
    ): Promise<IFaqs[] | []>;
    findById(faqId: string | ObjectId): Promise<IFaqs | null>;
    deleteFaq(faqId: string | ObjectId): Promise<void>;
}