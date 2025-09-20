import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../security/services/auth.service';
import { DepartmentService } from '../../services/department.service';
import { environment } from '../../../../environments/environment';
import { NetworkSecurity } from '../utils/network-security.util';
import {
  SecurityZoneType,
  getEndpointSecurityZone,
  getSecurityPolicyForUrl
} from '../config/network-zones.config';

/**
 * API Interceptor that adds authentication and department headers to outgoing requests
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check if we're on a secure channel in production
    NetworkSecurity.checkSecureChannel();
    
    // Only intercept requests going to our API
    if (!this.isApiRequest(request.url)) {
      return next.handle(request);
    }

    // Clone the request to add the new headers
    let headers = request.headers || new HttpHeaders();

    // Add auth token if available
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add department context if available
    const activeDepartment = this.departmentService.getActiveDepartment();
    if (activeDepartment) {
      headers = headers.set('X-Department-Id', activeDepartment.id.toString());
    }
    
    // Add role info if user is logged in
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role) {
      headers = headers.set('X-Role', currentUser.role);
    }

    // Add language preference
    headers = headers.set('Accept-Language', 'en-US');
    
    // Add security headers
    headers = this.addSecurityHeaders(headers, request);
    
    // Sanitize request body for potential security issues
    let secureBody = request.body;
    if (secureBody && typeof secureBody === 'object') {
      secureBody = NetworkSecurity.sanitizeOutgoingData(secureBody);
    }
    
    // Clone the request with the new headers and sanitized body
    const clonedRequest = request.clone({ 
      headers,
      body: secureBody
    });
    
    // Handle the request and monitor response
    return next.handle(clonedRequest).pipe(
      tap({
        // Log successful responses if needed
        next: (event) => {},
        // Log failed responses
        error: (error) => {
          if (error.status === 401) {
            // Handle unauthorized errors (e.g., token expired)
            console.warn('Authentication error:', error);
          } else if (error.status === 403) {
            // Handle forbidden errors (e.g., insufficient permissions)
            console.warn('Authorization error:', error);
          }
        }
      })
    );
  }
  
  /**
   * Add security headers to requests
   */
  private addSecurityHeaders(headers: HttpHeaders, request: HttpRequest<unknown>): HttpHeaders {
    // Generate a request ID for tracking/logging
    headers = headers.set('X-Request-ID', NetworkSecurity.generateNonce());
    
    // Determine the security zone for this request
    const securityZone = getEndpointSecurityZone(request.url);
    const securityPolicy = getSecurityPolicyForUrl(request.url);
    
    // Add CSRF protection based on security policy
    if (securityPolicy.csrfProtection && this.isStateChangingMethod(request.method)) {
      const csrfToken = localStorage.getItem('csrf_token') || NetworkSecurity.generateNonce(32);
      headers = headers.set('X-CSRF-Token', csrfToken);
      
      // Store token for future requests
      localStorage.setItem('csrf_token', csrfToken);
    }
    
    // Add security context zone
    headers = headers.set('X-Security-Zone', securityZone);
    
    // Add audit header if required by policy
    if (securityPolicy.requiresAudit) {
      headers = headers.set('X-Audit-Required', 'true');
    }
    
    // Add timestamp for request freshness validation
    headers = headers.set('X-Timestamp', Date.now().toString());
    
    // Add encryption header if required by policy
    if (securityPolicy.encryptPayload) {
      headers = headers.set('X-Payload-Encrypted', 'true');
      
      // In a real app, we would encrypt the payload here
      // For this simulation, we just add the header
    }
    
    return headers;
  }
  
  /**
   * Check if the HTTP method changes server state
   */
  private isStateChangingMethod(method: string): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  }
  
  /**
   * Check if the request URL is targeting our API
   */
  private isApiRequest(url: string): boolean {
    const apiUrl = environment.apiUrl || '/api';
    return url.startsWith(apiUrl) || !url.startsWith('http');
  }
}
