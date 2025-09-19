import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  managerId?: number;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
}

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

  constructor(private apiService: ApiService) {}

  // Employee CRUD operations
  getEmployees(): Observable<Employee[]> {
    return this.apiService.get<Employee[]>(this.basePath);
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
