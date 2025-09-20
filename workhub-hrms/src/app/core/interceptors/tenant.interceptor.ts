import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantService } from '../services/tenant.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tenantId = this.tenantService.getActiveTenantId();
    
    // Skip certain API endpoints that don't need tenant context (like auth endpoints)
    if (this.shouldSkipTenantContext(request.url)) {
      return next.handle(request);
    }
    
    if (tenantId) {
      // Clone the request and add the departmentId as a query parameter
      const modifiedRequest = request.clone({
        // Use setParams to safely add the parameter without overriding existing ones
        params: request.params.set('departmentId', tenantId.toString())
      });
      
      return next.handle(modifiedRequest);
    }
    
    // No active tenant, proceed with the original request
    return next.handle(request);
  }
  
  /**
   * Check if the request URL should skip tenant context
   */
  private shouldSkipTenantContext(url: string): boolean {
    // List of endpoints that don't need tenant context
    const skipEndpoints = [
      '/api/auth/login',
      '/api/auth/logout',
      '/api/auth/register',
      '/api/auth/reset-password',
      '/api/departments' // Department endpoints don't need tenant filtering
    ];
    
    // Check if the URL contains any of the skip endpoints
    return skipEndpoints.some(endpoint => url.includes(endpoint));
  }
}
