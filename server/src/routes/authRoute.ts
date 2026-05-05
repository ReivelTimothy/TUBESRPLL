import { Router } from 'express';
import { loginController, registerController } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.post('/register', registerController);

export default authRouter;
