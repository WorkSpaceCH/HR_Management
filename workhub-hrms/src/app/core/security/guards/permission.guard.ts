import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { NotificationService } from '../../services/notification.service';

/**
 * Permission Guard
 * 
 * Protects routes based on user permissions
 * More granular than role-based access control
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if route has required permissions
    const requiredPermissions = route.data?.['permissions'] as string[];
    
    // If no permissions specified, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    // Check if route specifies that ALL permissions are required
    const requireAll = route.data?.['requireAllPermissions'] === true;
    
    // Check permissions
    const hasPermission = requireAll
      ? this.permissionService.hasAllPermissions(requiredPermissions)
      : this.permissionService.hasAnyPermission(requiredPermissions);
    
    if (!hasPermission) {
      // Show notification about access denial
      this.notificationService.sendNotification({
        title: 'Access Denied',
        message: 'You do not have permission to access this resource.',
        type: 'error',
        category: 'system'
      });
      
      // Redirect to unauthorized page
      return this.router.createUrlTree(['/unauthorized']);
    }
    
    return true;
  }
}
