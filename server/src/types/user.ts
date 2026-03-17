export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface UserAttributes {
  id: string; 
  name: string;
  email: string;
  password?: string; 
  role: UserRole;
  managerId: string | null;
  baseSalary: number;
  
  currentChallenge?: string | null; 
  devices?: string | any[]; 
  
  createdAt?: Date;
  updatedAt?: Date;
}
