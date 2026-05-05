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

    const targetUser = await User.findByPk(data.userId);
    if (!targetUser) {
        throw new ApiError(ERROR_CODES.USER.NOT_FOUND.code, ERROR_CODES.USER.NOT_FOUND.message);
    }

    // Guardrail: a single penalty cannot exceed 30% of base salary
    const maxSinglePenalty = Number(targetUser.baseSalary || 0) * 0.3;

    if (issuer.role === 'MANAGER') {
        if (targetUser.managerId !== issuer.userId) {
            throw new ApiError(ERROR_CODES.PENALTY.NOT_SUBORDINATE.code, ERROR_CODES.PENALTY.NOT_SUBORDINATE.message);
        }
    }

    if (maxSinglePenalty > 0 && data.amount > maxSinglePenalty) {
        // Split over 3 installments when amount exceeds single-entry cap
        const baseInstallment = Math.floor((data.amount / 3) * 100) / 100;
        const installments = [baseInstallment, baseInstallment, Number((data.amount - baseInstallment * 2).toFixed(2))];

        const created = [];
        for (let i = 0; i < installments.length; i++) {
            const p = await Penalty.create({
                userId: data.userId,
                amount: installments[i],
                type: data.type,
                description: `${description} (installment ${i + 1}/3)`,
                createdBy: issuer.userId,
                date: data.date || new Date()
            });
            created.push(p.id);
        }

        return {
            msg: `Amount exceeds 30% salary cap (${maxSinglePenalty}). Penalty split into 3 installments.`,
            penaltyId: created[0]
        };
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