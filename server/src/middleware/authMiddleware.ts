import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { middlewareWrapper } from '../utils/middlewareWrapper';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { TokenPayloadRequest } from '../types/auth'; 

export const authenticateJWT = middlewareWrapper(async (req: TokenPayloadRequest, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) { 
        const err = ERROR_CODES.AUTH.NO_TOKEN;
        throw new ApiError(err.code, err.message);
    }

    const decoded = verifyToken(token);

    if (!decoded) { 
        const err = ERROR_CODES.AUTH.INVALID_TOKEN;
        throw new ApiError(err.code, err.message);
    }

    req.user = {
        userId: decoded.userId, 
        role: decoded.role
    };
    
});