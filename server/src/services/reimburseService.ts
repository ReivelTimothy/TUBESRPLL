// server/src/services/reimburseService.ts
import db from '../models';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { CreateReimburseRequest, ProcessReimburseRequest, ReimburseStatus } from '../types/reimburse';
import { TokenPayload } from '../types/auth';

const User = (db as any).User;
const Reimburse = (db as any).Reimburse;

const toPublicReimburse = (reimburse: any, baseUrl: string) => {
    const plain = reimburse.toJSON ? reimburse.toJSON() : reimburse;
    if (plain.attachmentUrl && !String(plain.attachmentUrl).startsWith('http')) {
        plain.attachmentUrl = `${baseUrl}${plain.attachmentUrl}`;
    }
    return plain;
};

export const requestReimburse = async (userId: string, data: CreateReimburseRequest) => {
    if (!data.description || !String(data.description).trim()) {
        throw new ApiError(400, 'Description is required.');
    }

    if (!Number.isFinite(data.amount) || data.amount <= 0) {
        throw new ApiError(400, 'Amount must be greater than 0.');
    }

    return await Reimburse.create({
        ...data,
        userId,
        status: ReimburseStatus.PENDING
    });
};

export const getReimburseRequests = async (currentUser: TokenPayload, baseUrl: string) => {
    if (currentUser.role === 'ADMIN') {
        const items = await Reimburse.findAll({ include: [{ model: User, as: 'User', attributes: ['name'] }] });
        return items.map((item: any) => toPublicReimburse(item, baseUrl));
    }

    if (currentUser.role === 'MANAGER') {
        const items = await Reimburse.findAll({
            include: [{
                model: User,
                as: 'User',
                where: { managerId: currentUser.userId },
                attributes: ['name']
            }]
        });
        return items.map((item: any) => toPublicReimburse(item, baseUrl));
    }

    const items = await Reimburse.findAll({
        where: { userId: currentUser.userId },
        include: [{ model: User, as: 'User', attributes: ['name'] }]
    });
    return items.map((item: any) => toPublicReimburse(item, baseUrl));
};

export const processReimburse = async (reimburseId: string, approver: TokenPayload, data: ProcessReimburseRequest) => {
    const reimburse = await Reimburse.findByPk(reimburseId, {
        include: [{ model: User, as: 'User' }]
    });

    if (!reimburse) throw new ApiError(ERROR_CODES.REIMBURSE.NOT_FOUND.code, ERROR_CODES.REIMBURSE.NOT_FOUND.message);
    if (reimburse.status !== ReimburseStatus.PENDING) throw new ApiError(ERROR_CODES.REIMBURSE.ALREADY_PROCESSED.code, ERROR_CODES.REIMBURSE.ALREADY_PROCESSED.message);

    // Logic: Admin can approve anyone. Manager can only approve their subordinates.
    const isManager = reimburse.User?.managerId === approver.userId;
    const isAdmin = approver.role === 'ADMIN';

    if (!isAdmin && !isManager) {
        throw new ApiError(ERROR_CODES.PERMISSION.FORBIDDEN.code, ERROR_CODES.PERMISSION.FORBIDDEN.message);
    }

    return await reimburse.update({
        status: data.status,
        processedBy: approver.userId
    });
};