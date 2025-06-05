import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { PayslipPDFService } from '../service/PayslipPDFService';

@injectable()
export class PayslipController {
  constructor(
    @inject("PayslipPDFService") private payslipPDFService: PayslipPDFService
  ) {}

  async downloadPayslip(req: Request, res: Response) {
    const { employeeId, month, year } = req.query;
    if (!employeeId || !month || !year) {
        res.status(400).json({ message: 'Missing required query params' });
    }

    await this.payslipPDFService.generateAndSendPDF(
      res,
      employeeId as string,
      Number(month),
      Number(year)
    );
  }
}
