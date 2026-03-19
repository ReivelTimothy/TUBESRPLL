// server/src/middleware/auth_middleware.ts
import { Request, Response } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { middlewareWrapper } from '../utils/middlewareWrapper';
import { TokenPayload } from '../types/user';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';


export const authenticateJWT = middlewareWrapper(async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) { 
        const err = ERROR_CODES.AUTH.NO_TOKEN;
        throw new ApiError(err.code, err.message);
    }

    const decoded = verifyToken(token) as TokenPayload;
    if (!decoded) { 
        const err = ERROR_CODES.AUTH.INVALID_TOKEN;
        throw new ApiError(err.code, err.message);
    }

    if (!req.body) { 
        const err = ERROR_CODES.AUTH.INVALID_TOKEN;
        throw new ApiError(err.code, err.message);
    } 

    req.body.userId = decoded.userId;
    req.body.role = decoded.role;
    
});