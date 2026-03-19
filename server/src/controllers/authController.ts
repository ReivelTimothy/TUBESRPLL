import * as authService from '../services/authService';
import { controllerWrapper } from '../utils/controllerWrapper';

export const login = controllerWrapper(async (req: any, res: any) => {
    const { email, password } = req.body;

    const data = await authService.authenticateUser(email, password);

    return {
        message: "Berhasil login",
        data
    };
});