import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.model';

/**
 * Security Context Service
 * 
 * Maintains the security context of the application including:
 * - Current user
 * - Permission sets
 * - Security policies
 * 
 * This service is the central point for security-related information
 */
@Injectable()
export class SecurityContextService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  
  // Observable streams
  public user$ = this.userSubject.asObservable();
  public permissions$ = this.permissionsSubject.asObservable();
  
  constructor() {}
  
  /**
   * Set the current authenticated user
   */
  setUser(user: User): void {
    this.userSubject.next(user);
    this.loadUserPermissions(user);
  }
  
  /**
   * Clear the current user (e.g., on logout)
   */
  clearUser(): void {
    this.userSubject.next(null);
    this.permissionsSubject.next([]);
  }
  
  /**
   * Get the current user value
   */
  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }
  
  /**
   * Check if the user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.permissionsSubject.getValue();
    return permissions.includes(permission);
  }
  
  /**
   * Check if the user has all the specified permissions
   */
  hasPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }
  
  /**
   * Check if the user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }
  
  /**
   * Get security attributes from the context
   * Useful for UI customization based on security policies
   */
  getSecurityAttribute(key: string): any {
    // This would typically check a security policy store
    // For now, we'll return some mock values
    const securityAttributes: {[key: string]: any} = {
      'maxAttempts': 5,
      'sessionTimeout': 30, // minutes
      'requireMFA': false,
      'passwordComplexity': 'medium'
    };
    
    return securityAttributes[key];
  }
  
  /**
   * Load permissions for a user based on their role
   * In a real app, this would likely come from an API
   */
  private loadUserPermissions(user: User): void {
    // Mock permission mapping based on roles
    const rolePermissions: {[key: string]: string[]} = {
      'employee': [
        'profile:read',
        'profile:edit',
        'leave:request',
        'leave:view-own'
      ],
      'manager': [
        'profile:read',
        'profile:edit',
        'leave:request',
        'leave:view-own',
        'leave:approve',
        'leave:reject',
        'team:view',
        'performance:review'
      ],
      'hr': [
        'profile:read',
        'profile:edit',
        'profile:create',
        'leave:request',
        'leave:view-own',
        'leave:view-all',
        'leave:approve',
        'leave:reject',
        'employees:view',
        'employees:edit',
        'departments:view'
      ],
      'admin': [
        'profile:read',
        'profile:edit',
        'profile:create',
        'profile:delete',
        'leave:request',
        'leave:view-own',
        'leave:view-all',
        'leave:approve',
        'leave:reject',
        'employees:view',
        'employees:edit',
        'employees:delete',
        'departments:view',
        'departments:create',
        'departments:edit',
        'departments:delete',
        'roles:manage',
        'system:configure'
      ]
    };
    
    // Get permissions for the user's role (or empty array if not found)
    const permissions = rolePermissions[user.role.toLowerCase()] || [];
    this.permissionsSubject.next(permissions);
  }
}
