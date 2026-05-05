// server/src/services/leaveService.ts
import db from '../models';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { LeaveStatus, CreateLeaveRequest, ProcessLeaveRequest } from '../types/leave';
import { TokenPayload } from '../types/auth';

const User = (db as any).User;
const Leave = (db as any).Leave;

export const requestLeave = async (userId: string, data: CreateLeaveRequest) => {
    if (new Date(data.startDate) > new Date(data.endDate)) {
        throw new ApiError(ERROR_CODES.LEAVE.INVALID_DATE.code, ERROR_CODES.LEAVE.INVALID_DATE.message);
    }

    if (new Date(data.startDate) < new Date()) {
        throw new ApiError(ERROR_CODES.LEAVE.PAST_DATE.code, ERROR_CODES.LEAVE.PAST_DATE.message);
    }

    // Staff does not set type; it remains null until approved
    return await Leave.create({
        userId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        type: null,
        status: LeaveStatus.PENDING
    });
};

export const getLeaveRequests = async (currentUser: TokenPayload) => {
    if (currentUser.role === 'ADMIN') {
        return await Leave.findAll({
            include: [{ model: User, as: 'User', attributes: ['name', 'role'] }]
        });
    }

    if (currentUser.role === 'MANAGER') {
        return await Leave.findAll({
            include: [{
                model: User,
                as: 'User',
                where: { managerId: currentUser.userId },
                attributes: ['name']
            }]
        });
    }

    return await Leave.findAll({
        where: { userId: currentUser.userId },
        include: [{ model: User, as: 'User', attributes: ['name'] }]
    });
};

export const getCalendarView = async () => {
    return await Leave.findAll({
        where: { status: LeaveStatus.APPROVED },
        include: [{ model: User, as: 'User', attributes: ['name'] }]
    });
};

export const processLeave = async (leaveId: string, approver: TokenPayload, data: ProcessLeaveRequest) => {
    const leave = await Leave.findByPk(leaveId, {
        include: [{ model: User, as: 'User' }]
    });

    if (!leave) throw new ApiError(ERROR_CODES.LEAVE.NOT_FOUND.code, ERROR_CODES.LEAVE.NOT_FOUND.message);
    if (leave.status !== LeaveStatus.PENDING) {
        throw new ApiError(ERROR_CODES.LEAVE.ALREADY_PROCESSED.code, ERROR_CODES.LEAVE.ALREADY_PROCESSED.message);
    }

    // Prevent manager/approver from approving their own leave
    if (leave.userId === approver.userId) {
        throw new ApiError(ERROR_CODES.PERMISSION.FORBIDDEN.code, 'Anda tidak bisa menyetujui pengajuan cuti Anda sendiri.');
    }

    const isManager = leave.User?.managerId === approver.userId;
    const isAdmin = approver.role === 'ADMIN';

    if (!isAdmin && !isManager) {
        throw new ApiError(ERROR_CODES.PERMISSION.FORBIDDEN.code, ERROR_CODES.PERMISSION.FORBIDDEN.message);
    }

    // Require type when approving
    if (data.status === LeaveStatus.APPROVED && !data.type) {
        throw new ApiError(ERROR_CODES.SYSTEM.VALIDATION_ERROR.code, 'Tipe cuti harus dipilih saat menyetujui.');
    }

    await leave.update({
        status: data.status,
        type: data.type || null,
        remarks: data.remarks || null,
        processedBy: approver.userId
    });

    return { msg: `Status cuti berhasil diperbarui menjadi ${data.status}` };
};