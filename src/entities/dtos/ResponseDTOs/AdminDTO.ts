export interface AdminResponseDTO {
    _id?: string;
    name?: string;
    email: string;
    role: "admin";
    createdAt?: Date | null;
    updatedAt?: Date | null;
}


export interface AdminLoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    admin: AdminResponseDTO;
}