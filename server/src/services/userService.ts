// server/src/services/userService.ts
import * as bcrypt from 'bcrypt';
import db from '../models';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { 
    UpdateUserRequest, 
    UpdateProfileRequest, 
    UserActionResponse,
    UserAttributes 
} from '../types/user';
import { UserRole } from '../types/enum';

const User = (db as any).User;

export const getAllUsers = async (): Promise<UserAttributes[]> => {
    return await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{ model: User, as: 'Manager', attributes: ['id', 'name'] }]
    });
};

export const getUserTree = async (): Promise<any> => {
    // Returns flat array of all users with managerId for frontend tree building
    // This allows infinite nesting at frontend instead of hardcoded backend recursion
    return await User.findAll({
        attributes: ['id', 'name', 'role', 'managerId'],
        order: [['name', 'ASC']]
    });
};

export const getUserTreeNested = async (): Promise<any> => {
    // Legacy: Returns nested tree structure (2-level depth only)
    // Use getUserTree() for infinite nesting support at frontend
    return await User.findAll({
        where: { managerId: null },
        attributes: ['id', 'name', 'role'],
        include: [{
            model: User,
            as: 'Subordinates',
            include: [{ model: User, as: 'Subordinates' }]
        }]
    });
};

export const getUserById = async (id: string): Promise<UserAttributes> => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
            { model: User, as: 'Manager', attributes: ['id', 'name'] },
            { model: User, as: 'Subordinates', attributes: ['id', 'name', 'role'] }
        ]
    });
    
    if (!user) {
        const err = ERROR_CODES.USER.NOT_FOUND;
        throw new ApiError(err.code, err.message);
    }
    return user;
};


export const updateUser = async (id: string, data: UpdateUserRequest): Promise<UserActionResponse> => {
    const user = await User.findByPk(id);
    if (!user) {
        const err = ERROR_CODES.USER.NOT_FOUND;
        throw new ApiError(err.code, err.message);
    }

    if (data.managerId === id) {
        const err = ERROR_CODES.USER.HIERARCHY_ERROR;
        throw new ApiError(err.code, err.message);
    }

    await user.update(data);
    return { 
        msg: "Employee data updated", 
        user: { id: user.id, name: user.name, role: user.role } 
    };
};

export const updateProfile = async (id: string, data: UpdateProfileRequest): Promise<UserActionResponse> => {
    const user = await User.findByPk(id);
    if (!user) {
        const err = ERROR_CODES.USER.NOT_FOUND;
        throw new ApiError(err.code, err.message);
    }

    // Explicitly update only allowed profile fields
    const { address, phone, photo } = data;
    await user.update({ address, phone, photo });
    
    return { msg: "Profile updated successfully" };
};

export const deleteUser = async (id: string): Promise<UserActionResponse> => {
    const user = await User.findByPk(id);
    if (!user) {
        const err = ERROR_CODES.USER.NOT_FOUND;
        throw new ApiError(err.code, err.message);
    }

    const subordinateCount = await User.count({ where: { managerId: id } });
    if (subordinateCount > 0) {
        const err = ERROR_CODES.USER.DELETE_FAILED;
        throw new ApiError(err.code, "Tidak bisa menghapus user yang masih memiliki bawahan.");
    }

    await user.destroy();
    return { msg: "User deleted successfully" };
};

export const getEligibleStaff = async (currentUser: { userId: string; role: UserRole }): Promise<UserAttributes[]> => {
    const baseWhere: any = { role: UserRole.STAFF };

    if (currentUser.role === UserRole.MANAGER) {
        baseWhere.managerId = currentUser.userId;
    }

    return await User.findAll({
        where: baseWhere,
        attributes: ['id', 'name', 'email', 'role', 'managerId', 'baseSalary']
    });
};