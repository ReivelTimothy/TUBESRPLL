import { Request } from 'express';
import { controllerWrapper } from '../utils/controllerWrapper';
import * as attendanceService from '../services/attendanceService';
import { TokenPayloadRequest } from '../types/auth';

export const getDailyQrController = controllerWrapper(async () => {
  const result = await attendanceService.getDailyQrToken();
  return { result };
});

export const scanAttendanceController = controllerWrapper(async (req: TokenPayloadRequest) => {
  const forwarded = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
  const ip = forwarded || req.ip || '';
  const { token } = req.body as { token?: string };
  const result = await attendanceService.scanAttendance(req.user, token || '', ip);
  return { result };
});

export const getAttendancesController = controllerWrapper(async (req: TokenPayloadRequest) => {
  const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
  const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;
  const userId = req.query.userId ? String(req.query.userId) : undefined;
  const result = await attendanceService.getAttendances(req.user, { startDate, endDate, userId });
  return { result };
});
