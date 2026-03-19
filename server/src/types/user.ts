export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'STAFF';
  managerId?: string | null;
  baseSalary?: number;
  
  // WebAuthn Fields
  credentialId?: string | null;
  publicKey?: string | null;
  counter?: number; 
  
  // Device & Network
  deviceId?: string | null;
  registeredIp?: string | null;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

