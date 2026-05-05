import { fetchFromAPI } from './api';
import type { CreatePenaltyRequest } from '../types/types';

export const createPenalty = async (data: CreatePenaltyRequest) => {
  const res = await fetchFromAPI('/penalty', 'POST', data);
  return res.data?.result || res.data || res;
};

export const getPenalties = async () => {
  const res = await fetchFromAPI('/penalty', 'GET');
  return res.data?.result || res.data || [];
};

export const deletePenalty = async (userId: string) => {
  const res = await fetchFromAPI(`/penalty/${userId}`, 'DELETE');
  return res.data?.result || res.data || res;
};

export default { createPenalty, getPenalties, deletePenalty };
