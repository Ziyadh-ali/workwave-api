export interface CreatePayrollRequestDTO {
  employeeId: string;
  month: number;
  year: number;
  presentDays: number;
  workingDays: number;
  baseSalary: number;
  taxDeduction: number;
  pfDeduction: number;
  totalDeduction: number;
  lossOfPayDeduction: number;
  netSalary: number;
}

export interface UpdatePayrollRequestDTO {
  status?: "Pending" | "Paid";
}

