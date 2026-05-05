import { Router } from 'express';
import {
	deleteUserController,
	getAllUsersController,
	getUserByIdController,
	getUserTreeController,
	updateProfileController,
	updateUserController,
} from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';

const userRouter = Router();

userRouter.use(authenticateJWT);

userRouter.get('/', 
    // authorizeRole([UserRole.ADMIN]), 
    getAllUsersController);
userRouter.get('/tree', authorizeRole([UserRole.ADMIN]), getUserTreeController);
userRouter.get('/:id', authorizeRole([UserRole.ADMIN]), getUserByIdController);
userRouter.put('/:id', authorizeRole([UserRole.ADMIN]), updateUserController);
userRouter.put('/:id/profile', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), updateProfileController);
userRouter.delete('/:id', authorizeRole([UserRole.ADMIN]), deleteUserController);

export default userRouter;
