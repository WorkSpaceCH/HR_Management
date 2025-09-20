import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TenantService } from '../core/services/tenant.service';
import { MOCK_EMPLOYEES } from '../core/data/mock-employees';
import { Employee } from '../core/models/employee.model';

export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  leaveType: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: number;
  comments?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private basePath = 'employees';
  
  constructor(
    private apiService: ApiService,
    private tenantService: TenantService
  ) {}

  // Employee CRUD operations
  /**
   * Get all employees with tenant filtering applied
   */
  getEmployees(): Observable<Employee[]> {
    // For development, we'll use mock data with simulated API delay
    return of(MOCK_EMPLOYEES).pipe(
      delay(300),
      map(employees => this.filterByTenant(employees))
    );
    
    // Real API implementation (commented out for now)
    // return this.apiService.get<Employee[]>(this.basePath);
  }
  
  /**
   * Filter employees by active tenant
   */
  private filterByTenant(employees: Employee[]): Employee[] {
    const tenantId = this.tenantService.getActiveTenantId();
    
    // If no tenant is selected, or user is admin, show all employees
    if (!tenantId) {
      return employees;
    }
    
    // Return only employees that belong to the current tenant (department)
    return employees.filter(emp => this.tenantService.belongsToActiveTenant(emp.departmentId));
  }

  getEmployee(id: number): Observable<Employee> {
    return this.apiService.get<Employee>(`${this.basePath}/${id}`);
  }

  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.apiService.post<Employee, Omit<Employee, 'id'>>(this.basePath, employee);
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.apiService.put<Employee, Partial<Employee>>(`${this.basePath}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.basePath}/${id}`);
  }

  // Leave management
  getLeaveRequests(employeeId?: number): Observable<LeaveRequest[]> {
    const path = employeeId ? `${this.basePath}/${employeeId}/leave-requests` : 'leave-requests';
    return this.apiService.get<LeaveRequest[]>(path);
  }

  submitLeaveRequest(employeeId: number, request: Omit<LeaveRequest, 'id' | 'employeeId' | 'status'>): Observable<LeaveRequest> {
    return this.apiService.post<LeaveRequest, Omit<LeaveRequest, 'id' | 'employeeId' | 'status'>>(
      `${this.basePath}/${employeeId}/leave-requests`, 
      request
    );
  }

  updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Observable<LeaveRequest> {
    return this.apiService.patch<LeaveRequest, Partial<LeaveRequest>>(
      `leave-requests/${id}`, 
      updates
    );
  }

  cancelLeaveRequest(id: number): Observable<void> {
    return this.apiService.delete<void>(`leave-requests/${id}`);
  }
}
