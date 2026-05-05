import { UserRole } from './enum';

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum LeaveType {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

// General message response
export interface MsgResponse {
  msg: string;
}

// User types (aligned with server)
export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string | null;
  baseSalary?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  managerId?: string;
  baseSalary?: number;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  managerId?: string | null;
  baseSalary?: number;
}

export interface UpdateProfileRequest {
  phone?: string;
  address?: string;
  photo?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

// Keep RegisterData flexible so current UI won't break; prefer `name` over `username`.
export interface RegisterData {
  name?: string;
  username?: string; // legacy UI
  email: string;
  password: string;
  role?: UserRole;
  managerId?: string | null;
  baseSalary?: number;
  phoneNum?: string; // legacy UI
}

export interface LoginResponse {
  msg: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

// Leave types (imported from server-like definitions)
// LeaveType and LeaveStatus defined above to match server

export interface LeaveAttributes {
  id: string;
  userId: string;
  startDate: string | Date;
  endDate: string | Date;
  reason: string;
  type?: LeaveType | null;
  remarks?: string | null;
  status: LeaveStatus;
  processedBy?: string;
}

export interface CreateLeaveRequest {
  startDate: string | Date;
  endDate: string | Date;
  reason: string;
}

export interface ProcessLeaveRequest {
  status: LeaveStatus;
  type?: LeaveType;
  remarks?: string;
}

// Reimburse types
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
  status: ReimburseStatus;
}

// Penalty types
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
  reason: string;
  type: PenaltyType;
  date: string | Date;
  createdBy: string;
}

export interface CreatePenaltyRequest {
  userId: string;
  amount: number;
  reason: string;
  type: PenaltyType;
  date?: string | Date;
}
