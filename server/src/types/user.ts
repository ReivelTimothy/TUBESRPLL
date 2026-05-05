// server/src/types/user.ts
import { msgResponse } from "./general";
import { UserRole } from './enum'; 

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address?: string | null;
  phone?: string | null;
  photo?: string | null;
  managerId?: string | null;
  baseSalary?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  managerId?: string;
  baseSalary?: number;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  managerId?: string | null;
  baseSalary?: number;
}

export interface UpdateProfileRequest {
  phone?: string;
  address?: string;
  photo?: string;
}

export interface UserActionResponse extends msgResponse {
  userId?: string;
  user?: Partial<UserAttributes>;
}