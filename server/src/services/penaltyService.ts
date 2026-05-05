// server/src/services/penaltyService.ts
import db from '../models';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { CreatePenaltyRequest, PenaltyActionResponse } from '../types/penalty';
import { TokenPayload } from '../types/auth';

const User = (db as any).User;
const Penalty = (db as any).Penalty;

export const createPenalty = async (issuer: TokenPayload, data: CreatePenaltyRequest): Promise<PenaltyActionResponse> => {
    if (data.amount <= 0) {
        throw new ApiError(ERROR_CODES.PENALTY.INVALID_AMOUNT.code, ERROR_CODES.PENALTY.INVALID_AMOUNT.message);
    }

    const description = (data.description || data.reason || '').trim();
    if (!description) {
        throw new ApiError(ERROR_CODES.SYSTEM.VALIDATION_ERROR.code, 'Deskripsi penalti wajib diisi.');
    }

    if (issuer.userId === data.userId) {
        throw new ApiError(ERROR_CODES.PENALTY.CANT_PENALIZE_SELF.code, ERROR_CODES.PENALTY.CANT_PENALIZE_SELF.message);
    }

    if (issuer.role === 'MANAGER') {
        const targetUser = await User.findByPk(data.userId);
        if (!targetUser || targetUser.managerId !== issuer.userId) {
            throw new ApiError(ERROR_CODES.PENALTY.NOT_SUBORDINATE.code, ERROR_CODES.PENALTY.NOT_SUBORDINATE.message);
        }
    }

    const penalty = await Penalty.create({
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        description,
        createdBy: issuer.userId,
        date: data.date || new Date()
    });

    return { 
        msg: "Penalti berhasil dicatat.", 
        penaltyId: penalty.id 
    };
};

export const getPenalties = async (currentUser: TokenPayload) => {
    if (currentUser.role === 'ADMIN') {
        return await Penalty.findAll({
            include: [{ model: User, as: 'User', attributes: ['id', 'name', 'managerId'] }],
            order: [['date', 'DESC']]
        });
    }

    if (currentUser.role === 'MANAGER') {
        return await Penalty.findAll({
            include: [{
                model: User,
                as: 'User',
                where: { managerId: currentUser.userId },
                attributes: ['id', 'name', 'managerId']
            }],
            order: [['date', 'DESC']]
        });
    }

    return await Penalty.findAll({
        where: { userId: currentUser.userId },
        include: [{ model: User, as: 'User', attributes: ['id', 'name', 'managerId'] }],
        order: [['date', 'DESC']]
    });
};

export const deletePenalty = async (id: string) => {
    const penalty = await Penalty.findByPk(id);
    if (!penalty) throw new ApiError(ERROR_CODES.PENALTY.NOT_FOUND.code, ERROR_CODES.PENALTY.NOT_FOUND.message);
    
    await penalty.destroy();
    return { msg: "Data penalti berhasil dihapus." };
};