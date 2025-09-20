import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { Department, DepartmentTree } from '../models/department.model';
import { MOCK_DEPARTMENTS } from '../data/mock-departments';
import { AuthService } from './auth.service';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly TENANT_ID_KEY = 'active_department_id';
  private activeDepartmentSubject = new BehaviorSubject<Department | null>(null);
  private allDepartmentsSubject = new BehaviorSubject<Department[]>([]);

  public activeDepartment$ = this.activeDepartmentSubject.asObservable();
  public allDepartments$ = this.allDepartmentsSubject.asObservable();

  constructor(private authService: AuthService) {
    // Initialize with mock departments
    this.allDepartmentsSubject.next(MOCK_DEPARTMENTS);
    
    // Load previously selected department from localStorage
    this.loadStoredDepartment();
    
    // Subscribe to auth changes to reset department context when needed
    this.authService.currentUser$.subscribe(user => {
      if (!user && this.activeDepartmentSubject.value) {
        // User logged out, reset department context
        this.clearActiveDepartment();
      } else if (user && !this.activeDepartmentSubject.value) {
        // User logged in but no active department, set default based on role
        this.setDefaultDepartment(user.role);
      }
    });
  }

  /**
   * Get all available departments
   */
  getAllDepartments(): Observable<Department[]> {
    // Simulate API call with delay
    return of(MOCK_DEPARTMENTS).pipe(
      delay(300)
    );
  }

  /**
   * Get departments as a hierarchical tree
   */
  getDepartmentTree(): Observable<DepartmentTree[]> {
    return this.getAllDepartments().pipe(
      map(departments => this.buildDepartmentTree(departments))
    );
  }

  /**
   * Get department by ID
   */
  getDepartmentById(id: number): Observable<Department | undefined> {
    return this.getAllDepartments().pipe(
      map(departments => departments.find(dept => dept.id === id))
    );
  }

  /**
   * Set active department
   */
  setActiveDepartment(department: Department): void {
    this.activeDepartmentSubject.next(department);
    localStorage.setItem(this.TENANT_ID_KEY, department.id.toString());
  }

  /**
   * Clear active department
   */
  clearActiveDepartment(): void {
    this.activeDepartmentSubject.next(null);
    localStorage.removeItem(this.TENANT_ID_KEY);
  }

  /**
   * Get active department
   */
  getActiveDepartment(): Department | null {
    return this.activeDepartmentSubject.value;
  }

  /**
   * Get active department ID for API calls
   */
  getActiveTenantId(): number | null {
    return this.activeDepartmentSubject.value?.id || null;
  }

  /**
   * Check if an item belongs to the active tenant
   */
  belongsToActiveTenant(itemDepartmentId: number | null | undefined): boolean {
    if (!itemDepartmentId) return false;
    
    const activeDeptId = this.getActiveTenantId();
    if (!activeDeptId) return true; // If no active tenant, show everything
    
    // Check if item's department ID matches active department
    return itemDepartmentId === activeDeptId;
  }

  /**
   * Load stored department from localStorage
   */
  private loadStoredDepartment(): void {
    const storedDeptId = localStorage.getItem(this.TENANT_ID_KEY);
    
    if (storedDeptId) {
      const deptId = parseInt(storedDeptId, 10);
      const dept = MOCK_DEPARTMENTS.find(d => d.id === deptId);
      
      if (dept) {
        this.activeDepartmentSubject.next(dept);
      } else {
        // Stored department no longer exists, remove from storage
        this.clearActiveDepartment();
      }
    }
  }

  /**
   * Set default department based on user role
   */
  private setDefaultDepartment(role: Role): void {
    let defaultDept: Department | undefined;
    
    switch (role) {
      case Role.ADMIN:
        // Admins default to Executive department
        defaultDept = MOCK_DEPARTMENTS.find(d => d.code === 'EXEC');
        break;
      case Role.HR:
        // HR users default to HR department
        defaultDept = MOCK_DEPARTMENTS.find(d => d.code === 'HR');
        break;
      case Role.MANAGER:
        // Managers default to Engineering department (just an example)
        defaultDept = MOCK_DEPARTMENTS.find(d => d.code === 'ENG');
        break;
      case Role.EMPLOYEE:
        // Employees default to their assigned department (using Engineering for this example)
        defaultDept = MOCK_DEPARTMENTS.find(d => d.code === 'ENG');
        break;
    }

    if (defaultDept) {
      this.setActiveDepartment(defaultDept);
    }
  }

  /**
   * Build department tree from flat department list
   */
  private buildDepartmentTree(departments: Department[]): DepartmentTree[] {
    // First pass: Create a map of all departments by ID
    const deptMap = new Map<number, DepartmentTree>();
    departments.forEach(dept => {
      deptMap.set(dept.id, { ...dept, children: [] });
    });
    
    // Second pass: Create parent-child relationships
    const roots: DepartmentTree[] = [];
    
    deptMap.forEach(dept => {
      if (dept.parentId) {
        const parent = deptMap.get(dept.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(dept);
        } else {
          // Parent doesn't exist, treat as root
          roots.push(dept);
        }
      } else {
        // No parent, it's a root department
        roots.push(dept);
      }
    });
    
    // Set levels for all departments in the tree
    this.setDepartmentLevels(roots, 0);
    
    return roots;
  }
  
  /**
   * Set level property for each department in the tree
   */
  private setDepartmentLevels(departments: DepartmentTree[], level: number): void {
    departments.forEach(dept => {
      dept.level = level;
      if (dept.children && dept.children.length > 0) {
        this.setDepartmentLevels(dept.children, level + 1);
      }
    });
  }
}
