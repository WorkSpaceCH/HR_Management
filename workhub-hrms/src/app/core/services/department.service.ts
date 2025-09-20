import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

// Department model
export interface Department {
  id: number;
  name: string;
  code: string;
  managerId?: number;
  parentDepartmentId?: number;
  isActive: boolean;
}

// Mock departments data for development
const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: 'Engineering',
    code: 'ENG',
    managerId: 2,
    isActive: true
  },
  {
    id: 2,
    name: 'Human Resources',
    code: 'HR',
    managerId: 3,
    isActive: true
  },
  {
    id: 3,
    name: 'Finance',
    code: 'FIN',
    managerId: 4,
    isActive: true
  },
  {
    id: 4,
    name: 'Marketing',
    code: 'MKT',
    managerId: 5,
    isActive: true
  },
  {
    id: 5,
    name: 'Product',
    code: 'PROD',
    managerId: 6,
    parentDepartmentId: 1,
    isActive: true
  }
];

/**
 * Department Service
 * 
 * Handles department data and context switching
 */
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departments = MOCK_DEPARTMENTS;
  
  // Active department context
  private activeDepartmentSubject = new BehaviorSubject<Department | null>(null);
  public activeDepartment$ = this.activeDepartmentSubject.asObservable();
  
  // Key for storing the active department ID in localStorage
  private readonly ACTIVE_DEPARTMENT_KEY = 'active_department_id';
  
  constructor() {
    this.loadActiveDepartment();
  }
  
  /**
   * Load the active department from localStorage
   */
  private loadActiveDepartment(): void {
    const savedDepartmentId = localStorage.getItem(this.ACTIVE_DEPARTMENT_KEY);
    
    if (savedDepartmentId) {
      const departmentId = parseInt(savedDepartmentId, 10);
      const department = this.departments.find(d => d.id === departmentId);
      
      if (department) {
        this.activeDepartmentSubject.next(department);
      } else {
        // If saved department is not found, use the first department
        this.activeDepartmentSubject.next(this.departments[0]);
      }
    } else {
      // Default to first department if none is saved
      this.activeDepartmentSubject.next(this.departments[0]);
    }
  }
  
  /**
   * Get the active department
   */
  getActiveDepartment(): Department | null {
    return this.activeDepartmentSubject.value;
  }
  
  /**
   * Set the active department
   */
  setActiveDepartment(departmentId: number): void {
    const department = this.departments.find(d => d.id === departmentId);
    
    if (department) {
      this.activeDepartmentSubject.next(department);
      localStorage.setItem(this.ACTIVE_DEPARTMENT_KEY, departmentId.toString());
    }
  }
  
  /**
   * Get all departments
   */
  getAllDepartments(): Observable<Department[]> {
    return of(this.departments);
  }
  
  /**
   * Get a department by ID
   */
  getDepartmentById(departmentId: number): Observable<Department | undefined> {
    const department = this.departments.find(d => d.id === departmentId);
    return of(department);
  }
  
  /**
   * Get child departments of a parent department
   */
  getChildDepartments(parentDepartmentId: number): Observable<Department[]> {
    const childDepartments = this.departments.filter(d => d.parentDepartmentId === parentDepartmentId);
    return of(childDepartments);
  }
}
