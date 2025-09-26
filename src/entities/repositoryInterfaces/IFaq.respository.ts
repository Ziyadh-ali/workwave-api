import { IFaqs } from "../models/IFaqs";

export interface IFaqRepository {
    find(
        search: string,
        skip: number,
        limit: number,
    ): Promise<IFaqs[] | []>; 
};