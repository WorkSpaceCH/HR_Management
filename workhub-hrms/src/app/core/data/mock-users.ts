import { Role, User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@workhub.com',
    firstName: 'Admin',
    lastName: 'User',
    role: Role.ADMIN
  },
  {
    id: 2,
    username: 'hr_manager',
    email: 'hr@workhub.com',
    firstName: 'HR',
    lastName: 'Manager',
    role: Role.HR
  },
  {
    id: 3,
    username: 'team_lead',
    email: 'manager@workhub.com',
    firstName: 'Team',
    lastName: 'Lead',
    role: Role.MANAGER
  },
  {
    id: 4,
    username: 'john_employee',
    email: 'employee@workhub.com',
    firstName: 'John',
    lastName: 'Employee',
    role: Role.EMPLOYEE
  }
];
