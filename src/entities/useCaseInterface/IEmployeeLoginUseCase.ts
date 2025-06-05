import { Response } from "express";
import { EmployeeLoginResponse } from "../employeeInterface/employeeLogin.interface";


export interface IEmployeeLoginUseCase {
    login(email : string , password : string) : Promise<EmployeeLoginResponse | null>;
    logout(res : Response) : Promise<void>;
}