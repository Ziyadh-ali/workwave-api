import { Response, Request } from "express";
import PDFDocument from 'pdfkit';
import { inject, injectable } from "tsyringe";
import { IPayrollUseCase } from "../../entities/useCaseInterface/IPayrollUseCase";
import { IPayroll } from "../../entities/models/IPayroll";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { HTTP_STATUS_CODES } from "../../shared/constants";
import { EmployeeResponseDTO } from "../../entities/dtos/ResponseDTOs/EmployeeDTO";

@injectable()
export class PayslipPDFService {
    constructor(
        @inject("IPayrollUseCase") private payrollUseCase: IPayrollUseCase,
        @inject("IEmployeeProfileUseCase") private employeeUseCase: IEmployeeProfileUseCase,
    ) { }

    async generateAndSendPDF(
        res: Response,
        employeeId: string,
        month: number,
        year: number,
    ) {
        const payroll: IPayroll | null = await this.payrollUseCase.getPayrollByMonthAndEmployeeId(employeeId, month, year);
        const employee = await this.employeeUseCase.getEmployeeDetails(employeeId);


        if (!payroll || !employee) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: 'Data not found' });
            return;
        }

        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${employee.fullName}_Payslip_${month}_${year}.pdf"`,
                'Content-Length': pdfData.length,
            });

            res.send(pdfData);
        });

        this.buildPDFContent(doc, employee, payroll, month, year);
        doc.end();
    }

    private buildPDFContent(
        doc: PDFKit.PDFDocument,
        employee: EmployeeResponseDTO,
        payroll: IPayroll,
        month: number,
        year: number
    ) {
        const startX = 50;
        let y = 60;

        doc.fontSize(18).text('Payslip', { align: 'center' });
        y += 30;
    
        doc.fontSize(12);
        doc.text(`Employee Name:`, startX, y).text(employee.fullName, startX + 150, y);
        y += 20;
        doc.text(`Department:`, startX, y).text(employee.department, startX + 150, y);
        y += 20;
        doc.text(`Month:`, startX, y).text(`${month}/${year}`, startX + 150, y);
        y += 30;
    
        doc.moveTo(startX, y).lineTo(550, y).stroke();
        y += 10;
    
        doc.fontSize(13).text('Earnings', startX, y);
        y += 20;
        doc.fontSize(12);
        doc.text(`Base Salary:`, startX, y).text(`₹${payroll.baseSalary.toFixed(2)}`, startX + 150, y);
        y += 30;
    
        doc.fontSize(13).text('Deductions', startX, y);
        y += 20;
        doc.fontSize(12);
        doc.text(`Tax Deduction:`, startX, y).text(`₹${payroll.taxDeduction.toFixed(2)}`, startX + 150, y);
        y += 20;
        doc.text(`PF Deduction:`, startX, y).text(`₹${payroll.pfDeduction.toFixed(2)}`, startX + 150, y);
        y += 20;
        doc.text(`LOP Deduction:`, startX, y).text(`₹${payroll.lossOfPayDeduction.toFixed(2)}`, startX + 150, y);
        y += 20;
        doc.text(`Total Deductions:`, startX, y).text(`₹${payroll.totalDeduction.toFixed(2)}`, startX + 150, y);
        y += 30;
    
        doc.text(`Present Days:`, startX, y).text(`${payroll.presentDays} / ${payroll.workingDays}`, startX + 150, y);
        y += 30;
    
        doc.fontSize(14).fillColor('black').text(`Net Salary: ₹${payroll.netSalary.toFixed(2)}`, startX, y, {
            underline: true,
        });
    }
}