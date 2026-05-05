// server/src/middleware/role_middleware.ts
import { Request, Response } from 'express';
import { middlewareWrapper } from '../utils/middlewareWrapper';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { TokenPayloadRequest } from '../types/auth';


export const authorizeRole = (allowedRoles: string[]) => {
    return middlewareWrapper(async (req: TokenPayloadRequest, res: Response) => {
        const userRole = req.user?.role; 
        
        console.log(`Authorizing user with role: ${userRole} for allowed roles: ${allowedRoles.join(', ')}`);
        console.log(`User info from token: ${JSON.stringify(req.user?.role)}`);

        if (!userRole || !allowedRoles.includes(userRole)) {
            const err = ERROR_CODES.PERMISSION.FORBIDDEN;
            throw new ApiError(err.code, `${err.message} (Required: ${allowedRoles.join(', ')})`);
        }
    });
};