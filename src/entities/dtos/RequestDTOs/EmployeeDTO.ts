export interface CreateEmployeeRequestDTO {
  fullName: string;
  email: string;
  department: string;
  role: "hr" | "developer" | "projectManager";
  phone?: number;
  address?: string;
  joinedAt?: string;
  manager?: string;
  profilePic?: string;
  salary: number;
  salaryType: "hourly" | "monthly";
  password: string;
}

export interface UpdateEmployeeRequestDTO {
  fullName?: string;
  department?: string;
  email?: string;
  password?: string;
  role?: "hr" | "developer" | "projectManager";
  phone?: number;
  address?: string;
  manager?: string;
  profilePic?: string;
  salary?: number;
  salaryType?: "hourly" | "monthly";
  status?: "active" | "inactive";
}


