import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  CanLoad,
  Route, 
  UrlSegment, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

/**
 * Auth Guard
 * 
 * Protects routes by checking if the user is authenticated
 * Can be used for CanActivate, CanActivateChild, and CanLoad route guards
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  /**
   * Determine if a route can be activated
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAccess(state.url);
  }

  /**
   * Determine if child routes can be activated
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAccess(state.url);
  }

  /**
   * Determine if a module can be loaded lazily
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = segments.map(segment => `/${segment.path}`).join('');
    return this.checkAccess(url);
  }

  /**
   * Check if the user has access to the requested URL
   * @param url The URL the user is attempting to access
   */
  private checkAccess(url: string): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      // User is logged in, record activity for session tracking
      this.sessionService.recordActivity();
      return true;
    }

    // User is not logged in, redirect to login page with return url
    return this.router.createUrlTree(['/auth/login'], { 
      queryParams: { returnUrl: url } 
    });
  }
}
