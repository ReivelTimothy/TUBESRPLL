import { Request } from 'express';
import * as authService from '../services/authService';
import { controllerWrapper } from '../utils/controllerWrapper';

export const loginController = controllerWrapper(async (req: Request) => {
    const result = await authService.login(req.body);
    return result;
});

export const registerController = controllerWrapper(async (req: Request) => {
    const result = await authService.register(req.body);
    return { result };
});

export const forgetPassword = controllerWrapper(async (req: Request) => {
    const data = req.body;
});