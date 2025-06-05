import { Document , model , ObjectId } from "mongoose";
import { EmployeeSchema } from "../../schemas/employee/EmployeeSchema";
import { Employee } from "../../../../entities/models/employeeEntities/employee.enitity";


export interface IEmployeeModel extends Omit<Employee , "_id">,Document {
    _id : ObjectId;
}

export const EmployeeModel = model<IEmployeeModel>("Employee",EmployeeSchema)