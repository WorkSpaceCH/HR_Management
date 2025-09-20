import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn,
  CanActivateChild,
  CanActivateChildFn
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      
    // First check if the user is logged in
    if (!this.authService.isLoggedIn) {
      // Not logged in, redirect to login page with return URL
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if route has data with required roles
    const requiredRoles = route.data['roles'] as Role[];
    
    // If no roles specified, allow access to authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Check if the user has any of the required roles
    if (this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }
    
    // User doesn't have required roles - redirect to unauthorized page
    this.router.navigate(['/unauthorized']);
    return false;
  }

  // CanActivateChild implementation to protect child routes
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}
