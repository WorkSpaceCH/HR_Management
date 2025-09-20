import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminSecurityService } from '../services/admin-security.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Admin Permission Guard
 * 
 * Feature-specific guard that handles admin-specific permission requirements
 * This is an example of module isolation - this guard is only available in the Admin module
 */
@Injectable()
export class AdminPermissionGuard implements CanActivate {
  constructor(
    private adminSecurityService: AdminSecurityService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check for admin permissions
    const requiredPermission = route.data?.['adminPermission'] as string;
    
    if (!requiredPermission) {
      return true;
    }
    
    // Check if user has the required admin permission
    const hasPermission = this.adminSecurityService.hasAdminPermission(requiredPermission);
    
    if (!hasPermission) {
      // Show notification about access denial
      this.notificationService.sendNotification({
        title: 'Admin Access Denied',
        message: 'You do not have the required administrative privileges for this operation.',
        type: 'error',
        category: 'system'
      });
      
      // Redirect to admin dashboard instead of the unauthorized page
      return this.router.createUrlTree(['/admin']);
    }
    
    return true;
  }
}
