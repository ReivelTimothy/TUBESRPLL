// server/src/types/penalty.ts
import { msgResponse } from "./general";

export enum PenaltyType {
  LATE = 'LATE',
  DAMAGE = 'DAMAGE', 
  UNPAID_LEAVE = 'UNPAID_LEAVE', 
  OTHER = 'OTHER'
}

export interface PenaltyAttributes {
  id: string;
  userId: string;
  amount: number;
  description: string;
  type: PenaltyType;
  date: Date;
  createdBy: string;
}

export interface CreatePenaltyRequest {
  userId: string;
  amount: number;
  description?: string;
  reason?: string;
  type: PenaltyType;
  date?: Date;
}

export interface PenaltyActionResponse extends msgResponse {
  penaltyId?: string;
}