import { Request } from 'express'; // dipake buat taru TokenPayload di req.user
import { msgResponse } from './general';
import { UserRole } from './enum'; 

export interface TokenPayload  {
  userId: string;
  role: UserRole;
}

export interface TokenPayloadRequest extends Request {
  user: TokenPayload;
}

export interface LoginResponse extends msgResponse {
  user : {
    id : string;
    name : string;
    email : string;
    role : UserRole;
  };
  token : string;
}

export interface RegisterRequest extends Request{
  id : string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  managerId: string | null;
  baseSalary: number;
}

export interface LoginRequest extends Request {
  email: string;
  password: string;
}


