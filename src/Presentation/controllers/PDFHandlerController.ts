import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { HTTP_STATUS_CODES } from '../../shared/constants';
import { PayslipPDFService } from '../../adapters/service/PayslipPDFService';

@injectable()
export class PayslipController {
  constructor(
    @inject("PayslipPDFService") private _payslipPDFService: PayslipPDFService
  ) {}

  async downloadPayslip(req: Request, res: Response) {
    const { employeeId, month, year } = req.query;
    if (!employeeId || !month || !year) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ message: 'Missing required query params' });
    }

    await this._payslipPDFService.generateAndSendPDF(
      res,
      employeeId as string,
      Number(month),
      Number(year)
    );
  }
}
