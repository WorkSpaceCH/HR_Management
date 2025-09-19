import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    if (this.authService.isLoggedIn) {
      // Check if route has data with roles
      const requiredRoles = route.data['roles'] as Array<string>;
      
      if (!requiredRoles || requiredRoles.length === 0) {
        // No specific roles required, just logged in
        return true;
      }
      
      // Check if the user has the required role
      if (this.authService.hasRole(requiredRoles)) {
        return true;
      }
      
      // User doesn't have required role
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    // Not logged in, redirect to login page
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
