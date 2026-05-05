import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_untuk_dev';

// Menggunakan interface TokenPayload sebagai parameter
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET_KEY, {
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