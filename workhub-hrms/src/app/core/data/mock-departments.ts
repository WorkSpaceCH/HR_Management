import { Department } from '../models/department.model';

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: 'Executive',
    code: 'EXEC',
    description: 'Executive leadership team',
    isActive: true
  },
  {
    id: 2,
    name: 'Human Resources',
    code: 'HR',
    description: 'Human Resources department',
    parentId: 1,
    isActive: true
  },
  {
    id: 3,
    name: 'Engineering',
    code: 'ENG',
    description: 'Software Engineering department',
    parentId: 1,
    isActive: true
  },
  {
    id: 4,
    name: 'Marketing',
    code: 'MKT',
    description: 'Marketing and Sales department',
    parentId: 1,
    isActive: true
  },
  {
    id: 5,
    name: 'Finance',
    code: 'FIN',
    description: 'Finance and Accounting department',
    parentId: 1,
    isActive: true
  },
  {
    id: 6,
    name: 'Frontend Development',
    code: 'FE',
    description: 'Frontend Development team',
    parentId: 3,
    isActive: true
  },
  {
    id: 7,
    name: 'Backend Development',
    code: 'BE',
    description: 'Backend Development team',
    parentId: 3,
    isActive: true
  },
  {
    id: 8,
    name: 'QA & Testing',
    code: 'QA',
    description: 'Quality Assurance team',
    parentId: 3,
    isActive: true
  },
  {
    id: 9,
    name: 'DevOps',
    code: 'OPS',
    description: 'Development Operations team',
    parentId: 3,
    isActive: true
  },
  {
    id: 10,
    name: 'Recruitment',
    code: 'REC',
    description: 'Recruitment and Onboarding team',
    parentId: 2,
    isActive: true
  }
];
