import crypto from 'crypto';
import db from '../models';
import { Op } from 'sequelize';
import { ApiError } from '../utils/apiError';
import { ERROR_CODES } from '../utils/errorCodes';
import { TokenPayload } from '../types/auth';

const Attendance = (db as any).Attendance;
const Penalty = (db as any).Penalty;
const User = (db as any).User;

const QR_SECRET = process.env.ATTENDANCE_QR_SECRET || 'attendance-secret';
const LATE_PENALTY_AMOUNT = Number(process.env.LATE_PENALTY_AMOUNT || 50000);
const OFFICE_START_HOUR = Number(process.env.OFFICE_START_HOUR || 7);
const OFFICE_GRACE_MINUTES = Number(process.env.OFFICE_GRACE_MINUTES || 15);

const normalizeIp = (ip: string) => ip?.replace('::ffff:', '') || '';
const getAllowedOfficeIps = (): string[] => {
  const fromEnv = (process.env.OFFICE_IP_WHITELIST || '').split(',').map((x) => normalizeIp(x.trim())).filter(Boolean);
  if (fromEnv.length > 0) return fromEnv;
  return ['127.0.0.1', '::1', 'localhost', '192.168.18.1'];
};

const getDateKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getDailyQrToken = async () => {
  const dateKey = getDateKey();
  const token = crypto.createHmac('sha256', QR_SECRET).update(dateKey).digest('hex');
  return { date: dateKey, token };
};

export const scanAttendance = async (user: TokenPayload, token: string, ip: string) => {
  const normalizedIp = normalizeIp(ip || '');
  const allowedIps = getAllowedOfficeIps();
  if (normalizedIp && !allowedIps.includes(normalizedIp)) {
    throw new ApiError(ERROR_CODES.PERMISSION.FORBIDDEN.code, 'Absensi hanya bisa dilakukan di jaringan kantor.');
  }

  const expected = await getDailyQrToken();
  if (!token || token !== expected.token) {
    throw new ApiError(ERROR_CODES.SYSTEM.VALIDATION_ERROR.code, 'QR absensi tidak valid atau kadaluarsa.');
  }

  const now = new Date();
  const start = new Date(now);
  start.setHours(OFFICE_START_HOUR, 0, 0, 0);
  const grace = new Date(start);
  grace.setMinutes(grace.getMinutes() + OFFICE_GRACE_MINUTES);

  const status = now > grace ? 'LATE' : 'PRESENT';

  const attendance = await Attendance.create({
    userId: user.userId,
    checkIn: now,
    status
  });

  if (status === 'LATE') {
    await Penalty.create({
      userId: user.userId,
      amount: LATE_PENALTY_AMOUNT,
      type: 'LATE',
      description: 'Auto penalty: late attendance scan',
      createdBy: user.userId,
      date: now,
      status: 'APPROVED'
    });
  }

  return { msg: 'Attendance recorded', status, attendanceId: attendance.id };
};

export const getAttendances = async (currentUser: TokenPayload, filters?: { startDate?: Date; endDate?: Date; userId?: string }) => {
  const where: any = {};

  if (filters?.startDate && !Number.isNaN(filters.startDate.getTime())) {
    where.checkIn = { ...(where.checkIn || {}), [Op.gte]: filters.startDate };
  }
  if (filters?.endDate && !Number.isNaN(filters.endDate.getTime())) {
    where.checkIn = { ...(where.checkIn || {}), [Op.lte]: filters.endDate };
  }

  if (currentUser.role === 'ADMIN') {
    if (filters?.userId) where.userId = filters.userId;
  } else if (currentUser.role === 'MANAGER') {
    const subordinates = await User.findAll({ where: { managerId: currentUser.userId }, attributes: ['id'] });
    const allowedIds = [currentUser.userId, ...subordinates.map((u: any) => u.id)];
    where.userId = filters?.userId && allowedIds.includes(filters.userId) ? filters.userId : allowedIds;
  } else {
    where.userId = currentUser.userId;
  }

  return await Attendance.findAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role', 'managerId'] }],
    order: [['checkIn', 'DESC']]
  });
};
