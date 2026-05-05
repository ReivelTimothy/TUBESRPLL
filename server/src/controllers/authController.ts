import { Request } from 'express';
import * as authService from '../services/authService';
import { controllerWrapper } from '../utils/controllerWrapper';

export const loginController = controllerWrapper(async (req: Request) => {
    const forwarded = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
    const result = await authService.login(req.body, forwarded || req.ip);
    return result;
});

export const registerController = controllerWrapper(async (req: Request) => {
    const result = await authService.register(req.body);
    return { result };
});

export const forgetPassword = controllerWrapper(async (req: Request) => {
    const data = req.body;
});