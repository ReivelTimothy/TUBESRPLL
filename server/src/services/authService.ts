import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtHelper'; 
import { ApiError } from '../utils/apiError'; 
import { ERROR_CODES } from '../utils/errorCodes'; 

const db = require('../models'); 
const User = db.User;

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    const err = ERROR_CODES.AUTH.NOT_FOUND;
    throw new ApiError(err.code, err.message);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const err = ERROR_CODES.AUTH.INVALID_CREDENTIALS;
    throw new ApiError(err.code, err.message);
  }

  const token = generateToken(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
};