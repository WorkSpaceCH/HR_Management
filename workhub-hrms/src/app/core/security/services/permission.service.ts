import { Injectable } from '@angular/core';
import { SecurityContextService } from './security-context.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

/**
 * Permission Service
 * 
 * Handles permission checks and role-based access control (RBAC)
 * Provides methods to check if a user has specific permissions
 * Uses the SecurityContextService for user data
 */
@Injectable()
export class PermissionService {
  constructor(private securityContext: SecurityContextService) { }
  
  /**
   * Check if the current user has a specific permission
   * @param permission Permission to check
   * @returns Boolean indicating if user has permission
   */
  hasPermission(permission: string): boolean {
    return this.securityContext.hasPermission(permission);
  }
  
  /**
   * Check if the current user has all specified permissions
   * @param permissions List of permissions to check
   * @returns Boolean indicating if user has all permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return this.securityContext.hasPermissions(permissions);
  }
  
  /**
   * Check if the current user has any of the specified permissions
   * @param permissions List of permissions to check
   * @returns Boolean indicating if user has any of the permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return this.securityContext.hasAnyPermission(permissions);
  }
  
  /**
   * Observable that emits true if user has the specified permission
   * @param permission Permission to check
   * @returns Observable<boolean>
   */
  hasPermission$(permission: string): Observable<boolean> {
    return this.securityContext.permissions$.pipe(
      map(permissions => permissions.includes(permission))
    );
  }
  
  /**
   * Get all permissions for the current user
   * @returns Array of permission strings
   */
  getAllPermissions(): string[] {
    return this.securityContext.getCurrentUser()?.permissions || [];
  }
  
  /**
   * Check if user has access to a specific resource
   * @param resource Resource identifier
   * @param action Action being performed (read, write, delete, etc.)
   * @returns Boolean indicating if access is allowed
   */
  hasResourceAccess(resource: string, action: 'read' | 'write' | 'delete' | 'admin'): boolean {
    const permission = `${resource}:${action}`;
    return this.hasPermission(permission);
  }
  
  /**
   * Check if the current user can access a feature
   * @param featureKey Feature identifier
   * @returns Boolean indicating if access is allowed
   */
  canAccessFeature(featureKey: string): boolean {
    // Feature access can be more complex, combining multiple permissions
    // This is a simple example
    return this.hasPermission(`feature:${featureKey}`);
  }
  
  /**
   * Check if the current user can perform department-specific actions
   * @param departmentId Department identifier
   * @param action Action to check
   * @returns Boolean indicating if access is allowed
   */
  hasDepartmentAccess(departmentId: number, action: string): boolean {
    const user = this.securityContext.getCurrentUser();
    
    // If user is admin, always grant access
    if (user?.role === 'ADMIN') {
      return true;
    }
    
    // If user is in HR, allow access to all departments for most actions
    if (user?.role === 'HR' && action !== 'delete') {
      return true;
    }
    
    // For managers, check if they manage the department
    if (user?.role === 'MANAGER') {
      return user.departmentId === departmentId;
    }
    
    // Employees can only view their own department
    if (user?.role === 'EMPLOYEE' && action === 'view') {
      return user.departmentId === departmentId;
    }
    
    return false;
  }
}
