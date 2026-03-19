import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/user';


const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_untuk_dev';

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (err) {
    return null;
  }
};