
import { injectable, inject } from "tsyringe";
import { IFaqUseCase } from "../../entities/useCaseInterface/IFaqUseCase";
import { faqValidationSchema } from "../../shared/validation/validator";
import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../shared/constants";

@injectable()
export class FaqController {
    constructor(
        @inject("IFaqUseCase") private faqUseCase: IFaqUseCase,
    ) { }

    async createFaq(req: Request, res: Response): Promise<void> {
        const validatedData = faqValidationSchema.parse(req.body);
        const faq = await this.faqUseCase.createFaq({
            ...validatedData,
            createdAt: new Date(),
        });
        res.status(201).json(faq);
    }

    async getFaqs(req: Request, res: Response): Promise<void> {
        const search = (req.query.search as string) || "";
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const faqs = await this.faqUseCase.find(search, page, pageSize);
        res.status(200).json({ faqs: faqs });
    }

    async getFaqById(req: Request, res: Response): Promise<void> {
        const { faqId } = req.params;
        if (!faqId) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid FAQ ID" });
        }

        const faq = await this.faqUseCase!.findById(faqId);
        if (!faq) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "FAQ not found" });
        }

        res.status(HTTP_STATUS_CODES.OK).json(faq);
    }

    async updateFaq(req: Request, res: Response): Promise<void> {
        const { faqId } = req.params;
        const { updatedData } = req.body
        console.log(updatedData)
        if (!faqId) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid FAQ ID" });
        }

        const updated = await this.faqUseCase!.updateFaq(faqId, updatedData);
        if (!updated) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "FAQ not found" });
        }

        res.status(HTTP_STATUS_CODES.OK).json(updated);
    }

    async deleteFaq(req: Request, res: Response): Promise<void> {
        const { faqId } = req.params;
        if (!faqId) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: "Invalid FAQ ID" });
        }

        await this.faqUseCase!.deleteFaq(faqId);
        res.status(HTTP_STATUS_CODES.OK).json({ message: "FAQ deleted successfully" });
    }
}