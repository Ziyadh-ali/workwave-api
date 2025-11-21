import { AdminLoginResponseDTO, AdminResponseDTO } from "../dtos/ResponseDTOs/AdminDTO";

export interface IAdminAuthUseCase {
    login(email: string, password: string): Promise<AdminLoginResponseDTO | null>;
    createAdmin(email: string, password: string): Promise<AdminResponseDTO>
}