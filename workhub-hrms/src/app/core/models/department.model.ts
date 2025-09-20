export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  managerId?: number;
  parentId?: number; // For hierarchical departments
  isActive: boolean;
}

export interface DepartmentTree extends Department {
  children?: DepartmentTree[];
  level?: number;
}
