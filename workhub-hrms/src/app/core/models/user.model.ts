export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  HR = 'HR',
  ADMIN = 'ADMIN'
}

// Helper functions for role hierarchy
export const roleHierarchy = {
  [Role.EMPLOYEE]: [Role.EMPLOYEE],
  [Role.MANAGER]: [Role.EMPLOYEE, Role.MANAGER],
  [Role.HR]: [Role.EMPLOYEE, Role.MANAGER, Role.HR],
  [Role.ADMIN]: [Role.EMPLOYEE, Role.MANAGER, Role.HR, Role.ADMIN]
};

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
