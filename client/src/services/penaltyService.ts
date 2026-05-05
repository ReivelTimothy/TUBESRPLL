import { fetchFromAPI } from './api';
import type { CreatePenaltyRequest, UserAttributes } from '../types/types';

export const createPenalty = async (data: CreatePenaltyRequest) => {
  const res = await fetchFromAPI('/penalties', 'POST', data);
  return res.data?.result || res.data || res;
};

export const getPenalties = async () => {
  const res = await fetchFromAPI('/penalties', 'GET');
  return res.data?.result || res.data || [];
};

export const getEligibleStaff = async (): Promise<UserAttributes[]> => {
  const res = await fetchFromAPI('/staff/eligible', 'GET');
  return res.data?.result || res.data || [];
};

export const deletePenalty = async (id: string) => {
  const res = await fetchFromAPI(`/penalties/${id}`, 'DELETE');
  return res.data?.result || res.data || res;
};

export default { createPenalty, getPenalties, getEligibleStaff, deletePenalty };
