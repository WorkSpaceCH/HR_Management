import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Role } from '../../models/user.model';

/**
 * Role Guard
 * 
 * Protects routes based on user roles
 * Checks if the current user has the required role(s) to access a route
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if route has role data
    const requiredRoles = route.data?.['roles'] as Role[];
    
    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      return this.router.createUrlTree(['/auth/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    }
    
    // Check if user has required role
    const hasRole = this.authService.hasAnyRole(requiredRoles);
    
    if (!hasRole) {
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
