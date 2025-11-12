import { Document , model , ObjectId } from "mongoose";
import { IFaqs } from "../../../entities/models/IFaqs";
import { FaqSchema } from "../schemas/FaqSchema";

export interface IFaqModel extends Omit<IFaqs , "_id">,Document {
    _id : ObjectId | string;
}

export const FaqModel = model<IFaqModel>("Faq",FaqSchema);