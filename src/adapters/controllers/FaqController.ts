import { Response, Request } from "express";
import { injectable, inject } from "tsyringe";
import { IFaqUseCase } from "../../entities/useCaseInterface/IFaqUseCase";
import { faqValidationSchema } from "../../shared/validation/validator";
import { z } from "zod"
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";

@injectable()
export class FaqController {
    constructor(
        @inject("IFaqUseCase") private faqUseCase: IFaqUseCase,
    ) { }

    async createFaq(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = faqValidationSchema.parse(req.body);
            const faq = await this.faqUseCase.createFaq({
                ...validatedData,
                createdAt: new Date(),
            });
            res.status(201).json(faq);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors });
            }
            console.error("Create FAQ Error:", error);
            res.status(500).json({ message: MESSAGES.ERROR.GENERIC });
        }
    }

    async getFaqs(req: Request, res: Response): Promise<void> {
        try {
            const search = (req.query.search as string) || "";
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const faqs = await this.faqUseCase.find(search, page, pageSize);
            res.status(200).json({ faqs: faqs });
        } catch (error) {
            console.error("Get FAQs Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getFaqById(req: Request, res: Response): Promise<void> {
        try {
            const {faqId} = req.params;
            if (!faqId) {
                res.status(400).json({ message: "Invalid FAQ ID" });
            }

            const faq = await this.faqUseCase!.findById(faqId);
            if (!faq) {
                res.status(404).json({ message: "FAQ not found" });
            }

            res.status(200).json(faq);
        } catch (error) {
            console.error("Get FAQ by ID Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateFaq(req: Request, res: Response): Promise<void> {
        try {
            const { faqId } = req.params;
            const {updatedData} = req.body
            console.log(updatedData)
            if (!faqId) {
                res.status(400).json({ message: "Invalid FAQ ID" });
            }

            const updated = await this.faqUseCase!.updateFaq(faqId, updatedData);
            if (!updated) {
                res.status(404).json({ message: "FAQ not found" });
            }

            res.status(200).json(updated);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors });
            }
            console.error("Update FAQ Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteFaq(req: Request, res: Response): Promise<void> {
        try {
            const {faqId} = req.params;
            if (!faqId) {
                res.status(400).json({ message: "Invalid FAQ ID" });
            }

            await this.faqUseCase!.deleteFaq(faqId);
            res.status(200).json({ message: "FAQ deleted successfully" });
        } catch (error) {
            console.error("Delete FAQ Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}