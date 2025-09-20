import { Employee } from '../models/employee.model';

export const MOCK_EMPLOYEES: Employee[] = [
  // Executive Department (1)
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@workhub.com',
    position: 'CEO',
    departmentId: 1,
    hireDate: '2020-01-15',
    salary: 180000,
    status: 'active'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@workhub.com',
    position: 'CFO',
    departmentId: 1,
    hireDate: '2020-02-10',
    salary: 160000,
    status: 'active'
  },
  
  // HR Department (2)
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@workhub.com',
    position: 'HR Director',
    departmentId: 2,
    managerId: 1,
    hireDate: '2020-03-05',
    salary: 110000,
    status: 'active'
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@workhub.com',
    position: 'HR Specialist',
    departmentId: 2,
    managerId: 3,
    hireDate: '2020-04-15',
    salary: 75000,
    status: 'active'
  },
  
  // Engineering Department (3)
  {
    id: 5,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@workhub.com',
    position: 'Engineering Director',
    departmentId: 3,
    managerId: 1,
    hireDate: '2020-02-20',
    salary: 130000,
    status: 'active'
  },
  {
    id: 6,
    firstName: 'Jennifer',
    lastName: 'Taylor',
    email: 'jennifer.taylor@workhub.com',
    position: 'Senior Developer',
    departmentId: 3,
    managerId: 5,
    hireDate: '2020-05-10',
    salary: 95000,
    status: 'active'
  },
  
  // Marketing Department (4)
  {
    id: 7,
    firstName: 'Robert',
    lastName: 'Anderson',
    email: 'robert.anderson@workhub.com',
    position: 'Marketing Director',
    departmentId: 4,
    managerId: 1,
    hireDate: '2020-03-15',
    salary: 115000,
    status: 'active'
  },
  {
    id: 8,
    firstName: 'Lisa',
    lastName: 'Thomas',
    email: 'lisa.thomas@workhub.com',
    position: 'Marketing Specialist',
    departmentId: 4,
    managerId: 7,
    hireDate: '2020-06-01',
    salary: 70000,
    status: 'on_leave'
  },
  
  // Finance Department (5)
  {
    id: 9,
    firstName: 'Daniel',
    lastName: 'White',
    email: 'daniel.white@workhub.com',
    position: 'Finance Manager',
    departmentId: 5,
    managerId: 2,
    hireDate: '2020-04-01',
    salary: 105000,
    status: 'active'
  },
  {
    id: 10,
    firstName: 'Sophia',
    lastName: 'Harris',
    email: 'sophia.harris@workhub.com',
    position: 'Accountant',
    departmentId: 5,
    managerId: 9,
    hireDate: '2020-07-15',
    salary: 65000,
    status: 'active'
  },
  
  // Frontend Development (6)
  {
    id: 11,
    firstName: 'James',
    lastName: 'Martin',
    email: 'james.martin@workhub.com',
    position: 'Frontend Lead',
    departmentId: 6,
    managerId: 5,
    hireDate: '2020-05-20',
    salary: 90000,
    status: 'active'
  },
  {
    id: 12,
    firstName: 'Olivia',
    lastName: 'Lee',
    email: 'olivia.lee@workhub.com',
    position: 'UI/UX Designer',
    departmentId: 6,
    managerId: 11,
    hireDate: '2020-08-05',
    salary: 75000,
    status: 'active'
  },
  
  // Backend Development (7)
  {
    id: 13,
    firstName: 'William',
    lastName: 'Clark',
    email: 'william.clark@workhub.com',
    position: 'Backend Lead',
    departmentId: 7,
    managerId: 5,
    hireDate: '2020-06-10',
    salary: 95000,
    status: 'active'
  },
  {
    id: 14,
    firstName: 'Emma',
    lastName: 'Lewis',
    email: 'emma.lewis@workhub.com',
    position: 'Backend Developer',
    departmentId: 7,
    managerId: 13,
    hireDate: '2020-09-01',
    salary: 78000,
    status: 'active'
  }
];
