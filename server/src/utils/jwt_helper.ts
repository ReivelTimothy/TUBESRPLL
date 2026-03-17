// server/src/utils/jwt_helper.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_untuk_dev';

export interface TokenPayload {
  userId: string;
  role: string; // Tambahkan role jika ada di model User Anda
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (err) {
    return null;
  }
};