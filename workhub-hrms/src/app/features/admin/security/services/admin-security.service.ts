import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SecurityContextService } from '../../../../core/security/services/security-context.service';
import { PermissionService } from '../../../../core/security/services/permission.service';
import { ApiService } from '../../../../core/network/services/api.service';
import { environment } from '../../../../../environments/environment';

/**
 * Admin Security Service
 * 
 * Feature-specific security service that handles admin-specific security concerns
 * This is an example of module isolation - this service is only available in the Admin module
 * and has specific knowledge of admin security requirements
 */
@Injectable()
export class AdminSecurityService {
  private adminPermissionsSubject = new BehaviorSubject<string[]>([]);
  public adminPermissions$ = this.adminPermissionsSubject.asObservable();
  
  // Admin-specific permission prefixes
  private readonly ADMIN_PERMISSION_PREFIXES = [
    'admin:',
    'system:',
    'role:',
    'user:admin'
  ];
  
  constructor(
    private securityContext: SecurityContextService,
    private permissionService: PermissionService,
    private apiService: ApiService
  ) {
    this.initAdminPermissions();
  }
  
  /**
   * Initialize admin permissions by filtering global permissions
   */
  private initAdminPermissions(): void {
    // Subscribe to global permissions and filter admin-specific ones
    this.securityContext.permissions$.subscribe(permissions => {
      const adminPermissions = permissions.filter(p => 
        this.ADMIN_PERMISSION_PREFIXES.some(prefix => p.startsWith(prefix))
      );
      this.adminPermissionsSubject.next(adminPermissions);
    });
  }
  
  /**
   * Check if user has a specific admin permission
   */
  hasAdminPermission(permission: string): boolean {
    return this.permissionService.hasPermission(permission);
  }
  
  /**
   * Check if user can manage users
   */
  canManageUsers(): boolean {
    return this.permissionService.hasPermission('users:manage');
  }
  
  /**
   * Check if user can manage roles
   */
  canManageRoles(): boolean {
    return this.permissionService.hasPermission('roles:manage');
  }
  
  /**
   * Check if user can manage system settings
   */
  canManageSystemSettings(): boolean {
    return this.permissionService.hasPermission('system:configure');
  }
  
  /**
   * Load security audit logs
   */
  getSecurityAuditLogs(): Observable<any[]> {
    // Using adminBasePath directly since base is not defined in endpoints
    const adminBasePath = '/admin';
    return this.apiService.get<any[]>(adminBasePath + '/security-audit');
  }
  
  /**
   * Check admin action authorization
   */
  isAuthorizedForAction(actionType: 'create' | 'update' | 'delete', resourceType: string): boolean {
    // Convert 'update' to 'write' to match the expected action types in PermissionService
    const mappedAction = actionType === 'create' || actionType === 'update' ? 'write' : 'delete';
    return this.permissionService.hasResourceAccess(resourceType, mappedAction);
  }
}
