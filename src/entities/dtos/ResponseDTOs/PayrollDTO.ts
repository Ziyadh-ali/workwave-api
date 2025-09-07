export interface PayrollResponseDTO {
  _id: string;
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
  status: "Pending" | "Paid";
  generatedAt?: Date;
}

export interface PayrollResponseWithEmployeeDTO {
  _id: string;
  employeeId: {
    _id: string;
    fullName: string;
    role: "admin" | "employee";
  };
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
  status: "Pending" | "Paid";
  generatedAt?: Date;
}
