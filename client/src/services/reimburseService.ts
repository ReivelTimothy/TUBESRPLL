import { fetchFromAPI } from './api';
import type { ProcessReimburseRequest } from '../types/types';

export const requestReimburse = async (data: FormData) => {
  const res = await fetchFromAPI('/reimburse', 'POST', data);
  return res.data?.result || res.data || res;
};

export const getReimburses = async () => {
  const res = await fetchFromAPI('/reimburse', 'GET');
  return res.data?.result || res.data || [];
};

export const processReimburse = async (id: string, data: ProcessReimburseRequest) => {
  const res = await fetchFromAPI(`/reimburse/${id}/process`, 'PATCH', data);
  return res.data?.result || res.data || res;
};

export default { requestReimburse, getReimburses, processReimburse };
