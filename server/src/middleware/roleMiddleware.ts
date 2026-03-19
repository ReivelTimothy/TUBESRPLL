// server/src/middleware/role_middleware.ts
import { Request, Response, NextFunction } from 'express';
import { middlewareWrapper } from '../utils/middlewareWrapper';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';

export const authorizeRole = (allowedRoles: string[]) => {
    return middlewareWrapper((req: Request, res: Response) => {
        const userRole = req.body.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            const err = ERROR_CODES.AUTH.UNAUTHORIZED;
            throw new ApiError(err.code, `${err.message} (Required: ${allowedRoles.join(', ')})`);
        }
    });
};