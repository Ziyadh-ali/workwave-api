import { inject, injectable } from "tsyringe";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/employee.repository";
import { Employee } from "../../entities/models/employeeEntities/employee.enitity";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { MESSAGES } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";

@injectable()
export class EmployeeProfileUseCase implements IEmployeeProfileUseCase {
    constructor(
        @inject("IEmployeeRepository") private employeeRepository: IEmployeeRepository,
        @inject("IBcrypt") private passwordBcrypt: IBcrypt,
    ) { }

    async updateEmployee(employeeId: string, data: Partial<Employee>): Promise<Employee | null> {
        try {

            console.log("email is changing")

            if (data.email) {
                let employee = await this.employeeRepository.findByEmail(data.email);

                if (employee) {
                    throw new Error("Eployee with the same email exists");
                }
            }


            const updateEmployee = await this.employeeRepository.updateEmployeeById(employeeId, data);
            if (!updateEmployee) {
                throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);
            }
            return updateEmployee;
        } catch (error) {
            throw new Error(MESSAGES.ERROR.USER.USER_UPDATE_FAILED);
        }
    }

    async getEmployeeDetails(id: string): Promise<Employee | null> {
        return await this.employeeRepository.findById(id)
    }

    async changePassword(employeeId: string, data: { currentPassword: string; newPassword: string; }): Promise<void> {
        try {
            const employee = await this.employeeRepository.findById(employeeId);
            if (!employee) {
                throw new Error(MESSAGES.ERROR.USER.USER_NOT_FOUND);
            }

            if (!data?.currentPassword || !data?.newPassword) {
                throw new Error(MESSAGES.ERROR.USER.PASSWORD_REQUIRED);
            }

            const isPasswordValid = await this.passwordBcrypt.compare(data.currentPassword, employee.password);
            if (!isPasswordValid) {
                throw new Error(MESSAGES.ERROR.USER.INVALID_CURRENT_PASSWORD);
            }

            const hashedPassword = await this.passwordBcrypt.hash(data.newPassword);
            const passwordChange = await this.employeeRepository.updateEmployeeById(employeeId, { password: hashedPassword });

            if (!passwordChange) {
                throw new Error(MESSAGES.ERROR.USER.PASSWORD_UPDATE_FAILED);
            }

            return;
        } catch (error) {
            throw error
        }
    }
}