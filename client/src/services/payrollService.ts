import { fetchFromAPI } from './api';
import type { PayrollRecord } from '../types/types';

export const getPayrolls = async (params?: { startDate?: string; endDate?: string }): Promise<PayrollRecord[]> => {
  const query = new URLSearchParams();
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);
  const endpoint = query.toString() ? `/payroll?${query.toString()}` : '/payroll';
  const res = await fetchFromAPI(endpoint, 'GET');
  return res.data?.result || res.data || [];
};

export const triggerCalculation = async (start?: string, end?: string) => {
  const res = await fetchFromAPI('/payroll/calculate', 'POST', { start, end });
  return res.data?.result || res.data || [];
};

export const updatePayroll = async (id: string, data: Partial<PayrollRecord>) => {
  const res = await fetchFromAPI(`/payroll/${id}`, 'PATCH', data);
  return res.data?.result || res.data || res;
};

export default { getPayrolls, triggerCalculation, updatePayroll };
