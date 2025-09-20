import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/**
 * Admin HTTP Interceptor
 * 
 * Adds admin-specific headers to outgoing HTTP requests
 * Feature-specific interceptor that is scoped only to the admin module
 */
@Injectable()
export class AdminHttpInterceptor implements HttpInterceptor {
  // Base admin API path
  private readonly adminApiPaths = [
    '/admin',
    environment.endpoints.admin.users,
    environment.endpoints.admin.departments,
    environment.endpoints.admin.roles,
    environment.endpoints.admin.permissions
  ];

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only intercept admin-related requests
    if (!this.isAdminRequest(request.url)) {
      return next.handle(request);
    }

    // Clone the request with admin-specific headers
    let headers = request.headers || new HttpHeaders();
    
    // Add special admin zone header to indicate this is an admin request
    headers = headers.set('X-Zone', 'admin');
    
    // Add security verification header
    headers = headers.set('X-Admin-Operation', 'true');
    
    // Add audit trail header for sensitive operations
    if (this.isSensitiveOperation(request)) {
      headers = headers.set('X-Audit-Trail', 'required');
    }
    
    // Clone the request with our new headers
    const adminRequest = request.clone({ headers });
    
    // Pass the modified request to the next handler
    return next.handle(adminRequest);
  }
  
  /**
   * Check if this is an admin-related request
   */
  private isAdminRequest(url: string): boolean {
    return this.adminApiPaths.some(path => url.includes(path));
  }
  
  /**
   * Check if this is a sensitive operation that requires audit trail
   * e.g., user deletion, role assignment, etc.
   */
  private isSensitiveOperation(request: HttpRequest<unknown>): boolean {
    // Check for sensitive operations based on HTTP method and URL patterns
    const isDelete = request.method === 'DELETE';
    const isUserRoleOperation = request.url.includes('/roles/') || request.url.includes('/permissions/');
    const isSystemConfigOperation = request.url.includes('/system/') && request.method !== 'GET';
    
    return isDelete || isUserRoleOperation || isSystemConfigOperation;
  }
}
