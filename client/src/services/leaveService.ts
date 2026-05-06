import { fetchFromAPI } from './api';
import type { CreateLeaveRequest, ProcessLeaveRequest } from '../types/types';

const unwrapLeaveData = (res: any) => res.data?.data?.result ?? res.data?.data ?? res.data?.result ?? res.data ?? res;

export const requestLeave = async (data: CreateLeaveRequest) => {
  const res = await fetchFromAPI('/leave', 'POST', data);
  return unwrapLeaveData(res);
};

export const getLeaveRequests = async () => {
  const res = await fetchFromAPI('/leave', 'GET');
  return unwrapLeaveData(res) || [];
};

export const getCalendarData = async () => {
  const res = await fetchFromAPI('/api/leaves/calendar-data', 'GET');
  return unwrapLeaveData(res) || [];
};

export const processLeave = async (id: string, data: ProcessLeaveRequest) => {
  const res = await fetchFromAPI(`/leave/${id}/process`, 'PATCH', data);
  return unwrapLeaveData(res);
};

export default { requestLeave, getLeaveRequests, getCalendarData, processLeave };
