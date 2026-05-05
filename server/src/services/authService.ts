import * as bcrypt from 'bcrypt';
import { RegisterRequest, LoginResponse, LoginRequest} from '../types/auth';
import { msgResponse } from '../types/general';
import { UserRole } from '../types/enum';
import { generateToken } from '../utils/jwtHelper'; 
import { ApiError } from '../utils/apiError'; 
import { ERROR_CODES } from '../utils/errorCodes'; 

import db from '../models'; 
const User = (db as any).User;


export const login = async (data : LoginRequest): Promise<LoginResponse> => {
  const user = await User.findOne({ where: { email: data.email } }); 

  if (!user || !await bcrypt.compare(data.password, user.password)) {
    const err = ERROR_CODES.AUTH.INVALID_CREDENTIALS;
    throw new ApiError(err.code, err.message);
  }
  
  const token = generateToken({ userId: user.id, role: user.role });

  return {
    msg : `Login successful as ${user.role}`,
    user : {
      id : user.id,
      name : user.name, 
      email : user.email,
      role : user.role
    },
    token : token
  };
};

export const register = async (data: RegisterRequest): Promise<msgResponse> => {
  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser) {
    const err = ERROR_CODES.AUTH.EMAIL_EXISTS;
    throw new ApiError(err.code, err.message);
  } 

  if (data.role !== UserRole.STAFF && data.role !== UserRole.MANAGER) { 
    const err = ERROR_CODES.AUTH.INVALID_ROLE;
    throw new ApiError(err.code, err.message);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await User.create({ 
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    managerId: data.managerId || null,
    baseSalary: data.baseSalary || 0
  });

  return {
    msg: `User ${newUser.name}, registered successfully, Go to Login page to access your account.`,
  };
};