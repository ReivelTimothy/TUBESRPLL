// server/src/types/leave.ts
import { msgResponse } from "./general";

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum LeaveType {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

export interface LeaveAttributes {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  type?: LeaveType;
  remarks?: string | null;
  status: LeaveStatus;
  processedBy?: string;
}

export interface CreateLeaveRequest {
  startDate: Date;
  endDate: Date;
  reason: string;
  type?: LeaveType;
}

export interface ProcessLeaveRequest {
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;
  type?: LeaveType;
  remarks?: string;
}

export interface LeaveActionResponse extends msgResponse {
  leaveId?: string;
}