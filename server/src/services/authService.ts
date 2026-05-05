import * as bcrypt from 'bcrypt';
import { RegisterRequest, LoginResponse, LoginRequest} from '../types/auth';
import { msgResponse } from '../types/general';
import { UserRole } from '../types/enum';
import { generateToken } from '../utils/jwtHelper'; 
import { ApiError } from '../utils/apiError'; 
import { ERROR_CODES } from '../utils/errorCodes'; 

import db from '../models'; 
const User = (db as any).User;
const Attendance = (db as any).Attendance;
const Penalty = (db as any).Penalty;

const normalizeIp = (ip: string) => ip?.replace('::ffff:', '') || '';

const getAllowedOfficeIps = (): string[] => {
  const fromEnv = (process.env.OFFICE_IP_WHITELIST || '').split(',').map((x) => normalizeIp(x.trim())).filter(Boolean);
  if (fromEnv.length > 0) return fromEnv;
  // Sensible local defaults for development
  return ['127.0.0.1', '::1', 'localhost'];
};

const OFFICE_START_HOUR = Number(process.env.OFFICE_START_HOUR || 7);
const OFFICE_GRACE_MINUTES = Number(process.env.OFFICE_GRACE_MINUTES || 15);
const LATE_PENALTY_AMOUNT = Number(process.env.LATE_PENALTY_AMOUNT || 50000);

// Helper: Get date key (YYYY-MM-DD) for checking same-day attendance
const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const login = async (data : LoginRequest, loginIp?: string): Promise<LoginResponse> => {
  const normalizedLoginIp = normalizeIp(loginIp || '');
  const allowedIps = getAllowedOfficeIps();
  if (normalizedLoginIp && !allowedIps.includes(normalizedLoginIp)) {
    const debugMessage = process.env.NODE_ENV === 'production'
      ? 'Login hanya diizinkan dari jaringan kantor.'
      : `Login hanya diizinkan dari jaringan kantor. IP terdeteksi: ${normalizedLoginIp || '(unknown)'} | Whitelist: ${allowedIps.join(', ') || '(empty)'}`;

    console.warn('[AUTH IP BLOCKED]', {
      loginIp: normalizedLoginIp || '(unknown)',
      allowedIps,
      email: data.email,
    });

    throw new ApiError(ERROR_CODES.AUTH.INVALID_CREDENTIALS.code, debugMessage);
  }

  const user = await User.findOne({ where: { email: data.email } }); 

  if (!user || !await bcrypt.compare(data.password, user.password)) {
    const err = ERROR_CODES.AUTH.INVALID_CREDENTIALS;
    throw new ApiError(err.code, err.message);
  }
  
  const token = generateToken({ userId: user.id, role: user.role });

  const now = new Date();
  const start = new Date(now);
  start.setHours(OFFICE_START_HOUR, 0, 0, 0);
  const grace = new Date(start);
  grace.setMinutes(grace.getMinutes() + OFFICE_GRACE_MINUTES);

  const attendanceStatus = now > grace ? 'LATE' : 'PRESENT';
  
  // Check if attendance already exists for today (same-day deduplication)
  const dateKey = getDateKey(now);
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);

  const existingAttendance = await Attendance.findOne({
    where: {
      userId: user.id,
      checkIn: {
        [db.Sequelize.Op.between]: [dayStart, dayEnd],
      },
    },
  });

  // Only create attendance if it doesn't exist for today
  if (!existingAttendance) {
    await Attendance.create({
      userId: user.id,
      checkIn: now,
      status: attendanceStatus,
    });

    if (attendanceStatus === 'LATE') {
      await Penalty.create({
        userId: user.id,
        amount: LATE_PENALTY_AMOUNT,
        type: 'LATE',
        description: 'Auto penalty: late login attendance',
        createdBy: user.id,
        date: now,
        status: 'APPROVED',
      });
    }
  }

  return {
    msg : `Login successful as ${user.role}`,
    user : {
      id : user.id,
      name : user.name, 
      email : user.email,
      role : user.role
    },
    token : token
  };
};

export const register = async (data: RegisterRequest): Promise<msgResponse> => {
  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser) {
    const err = ERROR_CODES.AUTH.EMAIL_EXISTS;
    throw new ApiError(err.code, err.message);
  } 

  if (data.role !== UserRole.STAFF && data.role !== UserRole.MANAGER) { 
    const err = ERROR_CODES.AUTH.INVALID_ROLE;
    throw new ApiError(err.code, err.message);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await User.create({ 
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    managerId: data.managerId || null,
    baseSalary: data.baseSalary || 0
  });

  return {
    msg: `User ${newUser.name}, registered successfully, Go to Login page to access your account.`,
  };
};