import { Employee } from "../models/employeeEntities/EmployeeEnitity";

export interface EmployeeLoginInterface {
    email : string , 
    password : string,
}

export interface EmployeeLoginResponse {
    accessToken : string;
    refreshToken : string;
    user : Partial<Employee>;
}