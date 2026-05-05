// server/src/controllers/userController.ts
import * as userService from '../services/userService';
import { controllerWrapper } from '../utils/controllerWrapper';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { TokenPayloadRequest } from '../types/auth';

export const getAllUsersController = controllerWrapper(async (req: any) => {
    const result = await userService.getAllUsers();
    return { result };
});

export const getUserTreeController = controllerWrapper(async (req: any) => {
    const result = await userService.getUserTree();
    return { result };
});

export const getUserByIdController = controllerWrapper(async (req: any) => {
    const { id } = req.params;
    const result = await userService.getUserById(id);
    return { result };
});

export const updateUserController = controllerWrapper(async (req: any) => {
    const { id } = req.params;
    const data = req.body;
    const result = await userService.updateUser(id, data);
    return { result };
});

export const updateProfileController = controllerWrapper(async (req: TokenPayloadRequest) => {
    const id = req.params.id as string;
    const data = req.body;
    const currentUser = req.user;

    // Security: Only Admin or the User themselves can edit profile
    if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
        const err = ERROR_CODES.PERMISSION.FORBIDDEN;
        throw new ApiError(err.code, "You can only update your own profile");
    }

    const result = await userService.updateProfile(id, data);
    return { result };
});

export const deleteUserController = controllerWrapper(async (req: any) => {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    return { result };
});