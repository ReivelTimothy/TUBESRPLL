import { fetchFromAPI } from './api';
import type { CreateLeaveRequest, ProcessLeaveRequest } from '../types/types';

export const requestLeave = async (data: CreateLeaveRequest) => {
  const res = await fetchFromAPI('/leave', 'POST', data);
  return res.data?.result || res.data || res;
};

export const getLeaveRequests = async () => {
  const res = await fetchFromAPI('/leave', 'GET');
  return res.data?.result || res.data || [];
};

export const getCalendar = async () => {
  const res = await fetchFromAPI('/leave/calendar', 'GET');
  return res.data?.result || res.data || [];
};

export const processLeave = async (id: string, data: ProcessLeaveRequest) => {
  const res = await fetchFromAPI(`/leave/${id}/process`, 'PATCH', data);
  return res.data?.result || res.data || res;
};

export default { requestLeave, getLeaveRequests, getCalendar, processLeave };
