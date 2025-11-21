export interface AdminRequestDTO {
    name?: string;
    email: string;
    password : string;
    role: "admin";
}

export interface AdminLoginInterface {
    email : string;
    password : string;
}
