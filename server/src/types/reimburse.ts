import { msgResponse } from "./general";

export enum ReimburseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ReimburseAttributes {
  id: string;
  userId: string;
  amount: number;
  description: string;
  status: ReimburseStatus;
  attachmentUrl?: string;
  processedBy?: string; 
}

export interface CreateReimburseRequest {
  amount: number;
  description: string;
  attachmentUrl?: string;
}

export interface ProcessReimburseRequest {
  status: ReimburseStatus.APPROVED | ReimburseStatus.REJECTED;
}