export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: number;
  managerId?: number;
  hireDate: string; // ISO date string format
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
}
