import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { SecurityZoneType, getEndpointSecurityZone, SecurityZonePolicy, getSecurityPolicyForUrl } from '../config/network-zones.config';
import { SecurityContextService } from '../../security/services/security-context.service';
import { NetworkSecurity } from '../utils/network-security.util';
import { environment } from '../../../../environments/environment';

/**
 * Network Security Service
 * 
 * Centralizes network security concerns:
 * - Enforcing zone-based security policies
 * - Validating API requests against security rules
 * - Managing CSRF protection
 * - Monitoring for security violations
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkSecurityService {
  constructor(private securityContext: SecurityContextService) {}
  
  /**
   * Validate a request against security policy
   * @returns true if request is allowed, false otherwise
   */
  validateRequest(request: HttpRequest<any>): boolean {
    const securityZone = getEndpointSecurityZone(request.url);
    const policy = getSecurityPolicyForUrl(request.url);
    
    // Check if the request meets the security requirements
    if (policy.requiresAuth && !this.isAuthenticated()) {
      console.warn('Security violation: Authentication required for', request.url);
      return false;
    }
    
    // Admin zone check
    if (securityZone === SecurityZoneType.Admin && !this.isAdmin()) {
      console.warn('Security violation: Admin access required for', request.url);
      return false;
    }
    
    // System zone check
    if (securityZone === SecurityZoneType.System && !this.isSystemAdmin()) {
      console.warn('Security violation: System admin access required for', request.url);
      return false;
    }
    
    // Check for state-changing requests that require CSRF protection
    if (policy.csrfProtection && this.isStateChangingMethod(request.method)) {
      const csrfToken = request.headers.get('X-CSRF-Token');
      if (!csrfToken || !this.validateCsrfToken(csrfToken)) {
        console.warn('Security violation: CSRF token missing or invalid');
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Get the security zone for a URL
   */
  getSecurityZone(url: string): SecurityZoneType {
    return getEndpointSecurityZone(url);
  }
  
  /**
   * Get the security policy for a URL
   */
  getSecurityPolicy(url: string): SecurityZonePolicy {
    return getSecurityPolicyForUrl(url);
  }
  
  /**
   * Generate a CSRF token
   */
  generateCsrfToken(): string {
    const csrfToken = NetworkSecurity.generateNonce(32);
    localStorage.setItem('csrf_token', csrfToken);
    return csrfToken;
  }
  
  /**
   * Validate a CSRF token
   */
  validateCsrfToken(token: string): boolean {
    const storedToken = localStorage.getItem('csrf_token');
    return !!storedToken && token === storedToken;
  }
  
  /**
   * Check if the user is authenticated
   */
  private isAuthenticated(): boolean {
    return this.securityContext.getCurrentUser() !== null;
  }
  
  /**
   * Check if the user has admin role
   */
  private isAdmin(): boolean {
    const user = this.securityContext.getCurrentUser();
    return !!user && user.role === 'ADMIN';
  }
  
  /**
   * Check if the user has system admin access
   */
  private isSystemAdmin(): boolean {
    // For this example, we'll treat regular admins as system admins
    // In a real app, you might have a separate role or permission
    return this.isAdmin();
  }
  
  /**
   * Check if the HTTP method changes server state
   */
  private isStateChangingMethod(method: string): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  }
}
