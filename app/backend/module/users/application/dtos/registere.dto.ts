import { UserRole } from "../../domain/enums/role.enum";
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string;
  role: UserRole;
  // isActive: boolean;
}


export interface RegisterResponse {
  message: string;
  token: {
    access_token: string;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    role: string;
  };
}

