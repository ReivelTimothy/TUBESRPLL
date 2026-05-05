import { fetchFromAPI } from './api';

export interface AttendanceRecord {
  id: string;
  userId: string;
  user?: { id: string; name: string; role: string; managerId?: string | null };
  checkIn: string;
  checkOut?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAttendances = async (params?: { startDate?: string; endDate?: string; userId?: string }): Promise<AttendanceRecord[]> => {
  const query = new URLSearchParams();
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);
  if (params?.userId) query.set('userId', params.userId);
  const endpoint = query.toString() ? `/attendance?${query.toString()}` : '/attendance';
  const res = await fetchFromAPI(endpoint, 'GET');
  return res.data?.result || res.data || [];
};

export const getDailyQr = async () => {
  const res = await fetchFromAPI('/attendance/qr/daily', 'GET');
  return res.data?.result || res.data || null;
};

export const scanAttendance = async (token: string) => {
  const res = await fetchFromAPI('/attendance/scan', 'POST', { token });
  return res.data?.result || res.data || null;
};

export default { getAttendances, getDailyQr, scanAttendance };