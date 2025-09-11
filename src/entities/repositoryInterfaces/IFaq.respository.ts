import { ObjectId } from "mongoose";
import { IFaqs } from "../models/IFaqs";

export interface IFaqRepository {
    createFaq(data: IFaqs): Promise<IFaqs>;
    updateFaq(faqId : string | ObjectId,updatedData: Partial<IFaqs>): Promise<IFaqs | null>;
    deleteFaq(faqId: string | ObjectId): Promise<void>;
    findFaqById(faqId: string | ObjectId): Promise<IFaqs | null>;
    find(
        search: string,
        skip: number,
        limit: number,
    ): Promise<IFaqs[] | []>; 
    getAllFaqs(): Promise<IFaqs[] | []>;
};