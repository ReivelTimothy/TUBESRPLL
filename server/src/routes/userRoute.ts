import { Router } from 'express';
import {
	deleteUserController,
	getAllUsersController,
	getEligibleStaffController,
	getUserByIdController,
	getUserTreeController,
	updateProfileController,
	updateUserController,
	updateMyProfileController
} from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import { UserRole } from '../types/enum';

const userRouter = Router();

userRouter.use(authenticateJWT);

userRouter.get('/staff/eligible', authorizeRole([UserRole.ADMIN, UserRole.MANAGER]), getEligibleStaffController);
userRouter.put('/me', authorizeRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]), updateMyProfileController);
userRouter.get('/', 
    // authorizeRole([UserRole.ADMIN]), 
    getAllUsersController);
// Allow any authenticated user to view the hierarchy
userRouter.get('/tree', getUserTreeController);
// Allow any authenticated user to view a user's public profile (read-only)
userRouter.get('/:id', getUserByIdController);
// Admin-only: update user (role, manager, baseSalary, etc.)
userRouter.put('/:id', authorizeRole([UserRole.ADMIN]), updateUserController);
// Admin-only: update another user's profile fields. Self-updates should use PUT /me
userRouter.put('/:id/profile', authorizeRole([UserRole.ADMIN]), updateProfileController);
userRouter.delete('/:id', authorizeRole([UserRole.ADMIN]), deleteUserController);

export default userRouter;
