import { inject, injectable } from "tsyringe";
import { IEmployeeRepository } from "../../entities/repositoryInterfaces/employee/EmployeeRepository";
import { Employee } from "../../entities/models/employeeEntities/EmployeeEnitity";
import { IEmployeeProfileUseCase } from "../../entities/useCaseInterface/IEmployeeProfileUseCase";
import { HTTP_STATUS_CODES, MESSAGES } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../shared/errors/CustomError";
import { UpdateEmployeeRequestDTO } from "../../entities/dtos/RequestDTOs";
import { EmployeeResponseDTO } from "../../entities/dtos/ResponseDTOs";
import { EmployeeMapper } from "../../entities/mapping/EmployeeMapper";

@injectable()
export class EmployeeProfileUseCase implements IEmployeeProfileUseCase {
  constructor(
    @inject("IEmployeeRepository")
    private employeeRepository: IEmployeeRepository,
    @inject("IBcrypt") private passwordBcrypt: IBcrypt
  ) {}

  async updateEmployee(
    employeeId: string,
    data: UpdateEmployeeRequestDTO
  ): Promise<EmployeeResponseDTO | null> {
    console.log(data);
    if (data.email) {
      let employee = await this.employeeRepository.findByEmail(data.email);

      if (employee) {
        throw new CustomError(
          "Eployee with the same email exists",
          HTTP_STATUS_CODES.BAD_REQUEST
        );
      }
    }

    const updateEmployee = await this.employeeRepository.updateEmployeeById(
      employeeId,
      data
    );
    if (!updateEmployee) {
      throw new CustomError(
        MESSAGES.ERROR.USER.USER_NOT_FOUND,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    return EmployeeMapper.toResponseDTO(updateEmployee);
  }

  async getEmployeeDetails(id: string): Promise<EmployeeResponseDTO | null> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new CustomError(
        MESSAGES.ERROR.USER.USER_NOT_FOUND,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
    return EmployeeMapper.toResponseDTO(employee);
  }

  async changePassword(
    employeeId: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<void> {
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      throw new CustomError(
        MESSAGES.ERROR.USER.USER_NOT_FOUND,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    if (!data?.currentPassword || !data?.newPassword) {
      throw new CustomError(
        MESSAGES.ERROR.USER.PASSWORD_REQUIRED,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const isPasswordValid = await this.passwordBcrypt.compare(
      data.currentPassword,
      employee.password
    );
    if (!isPasswordValid) {
      throw new CustomError(
        MESSAGES.ERROR.USER.INVALID_CURRENT_PASSWORD,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    const hashedPassword = await this.passwordBcrypt.hash(data.newPassword);
    const passwordChange = await this.employeeRepository.updateEmployeeById(
      employeeId,
      { password: hashedPassword }
    );

    if (!passwordChange) {
      throw new CustomError(
        MESSAGES.ERROR.USER.PASSWORD_UPDATE_FAILED,
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }

    return;
  }
}
