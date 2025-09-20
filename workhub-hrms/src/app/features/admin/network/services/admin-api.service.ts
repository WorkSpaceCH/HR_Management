import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../core/network/services/api.service';

/**
 * Admin API Service
 * 
 * Encapsulates all admin-specific API calls
 * This is an example of module isolation - this service is only available in the Admin module
 */
@Injectable()
export class AdminApiService {
  // Base admin API path
  private readonly adminBasePath = '/admin';
  
  constructor(private apiService: ApiService) {}
  
  /**
   * Get all users
   */
  getUsers(): Observable<any[]> {
    return this.apiService.get<any[]>(environment.endpoints.admin.users);
  }
  
  /**
   * Get user by ID
   */
  getUserById(userId: number): Observable<any> {
    return this.apiService.get<any>(`${environment.endpoints.admin.users}/${userId}`);
  }
  
  /**
   * Create a new user
   */
  createUser(userData: any): Observable<any> {
    return this.apiService.post<any>(environment.endpoints.admin.users, userData);
  }
  
  /**
   * Update an existing user
   */
  updateUser(userId: number, userData: any): Observable<any> {
    return this.apiService.put<any>(`${environment.endpoints.admin.users}/${userId}`, userData);
  }
  
  /**
   * Delete a user
   */
  deleteUser(userId: number): Observable<void> {
    return this.apiService.delete<void>(`${environment.endpoints.admin.users}/${userId}`);
  }
  
  /**
   * Get all departments
   */
  getDepartments(): Observable<any[]> {
    return this.apiService.get<any[]>(environment.endpoints.admin.departments);
  }
  
  /**
   * Create a new department
   */
  createDepartment(departmentData: any): Observable<any> {
    return this.apiService.post<any>(environment.endpoints.admin.departments, departmentData);
  }
  
  /**
   * Get all roles
   */
  getRoles(): Observable<any[]> {
    return this.apiService.get<any[]>(environment.endpoints.admin.roles);
  }
  
  /**
   * Get all permissions
   */
  getPermissions(): Observable<any[]> {
    return this.apiService.get<any[]>(environment.endpoints.admin.permissions);
  }
  
  /**
   * Assign role to user
   */
  assignRoleToUser(userId: number, roleId: number): Observable<void> {
    return this.apiService.post<void>(
      `${environment.endpoints.admin.users}/${userId}/roles/${roleId}`, {}
    );
  }
  
  /**
   * Get security audit logs
   */
  getSecurityAuditLogs(): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.adminBasePath}/security-audit`);
  }
}
