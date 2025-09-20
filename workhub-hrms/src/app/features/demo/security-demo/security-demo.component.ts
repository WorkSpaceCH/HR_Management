import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/network/services/api.service';
import { NetworkSecurityService } from '../../../core/network/services/network-security.service';
import { SecurityContextService } from '../../../core/security/services/security-context.service';
import { PermissionService } from '../../../core/security/services/permission.service';
import { SecurityZoneType } from '../../../core/network/config/network-zones.config';
import { NotificationService } from '../../../core/services/notification.service';

/**
 * Security Demo Component
 * 
 * Demonstrates the network security and role-based access control features
 */
@Component({
  selector: 'app-security-demo',
  templateUrl: './security-demo.component.html',
  styleUrls: ['./security-demo.component.scss']
})
export class SecurityDemoComponent implements OnInit {
  // Security info
  currentUser: any = null;
  permissions: string[] = [];
  csrfToken: string = '';
  
  // API endpoints for testing
  endpoints = [
    { url: '/api/auth/login', zone: SecurityZoneType.Public, description: 'Login endpoint (Public)' },
    { url: '/api/employees/profile', zone: SecurityZoneType.Protected, description: 'Employee Profile (Protected)' },
    { url: '/api/hr/employees', zone: SecurityZoneType.Secure, description: 'HR Employees (Secure)' },
    { url: '/api/admin/users', zone: SecurityZoneType.Admin, description: 'Admin Users (Admin)' },
    { url: '/api/system/config', zone: SecurityZoneType.System, description: 'System Config (System)' }
  ];
  
  // Request details
  selectedEndpoint: string = this.endpoints[0].url;
  requestMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  requestBody: string = '{}';
  requestHeaders: {[key: string]: string} = {};
  
  // Response
  response: any = null;
  responseHeaders: {[key: string]: string} = {};
  responseStatus: number | null = null;
  responseTime: number | null = null;
  
  // Security validation result
  securityValidation: boolean = false;
  securityDetails: any = null;
  
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private networkSecurityService: NetworkSecurityService,
    private securityContextService: SecurityContextService,
    private permissionService: PermissionService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    // Get current user
    this.currentUser = this.securityContextService.getCurrentUser();
    
    // Get permissions
    if (this.currentUser) {
      this.permissions = this.permissionService.getAllPermissions();
    }
    
    // Generate CSRF token
    this.csrfToken = this.networkSecurityService.generateCsrfToken();
    
    // Set default headers
    this.requestHeaders = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.csrfToken
    };
  }
  
  /**
   * Test security validation for the selected endpoint
   */
  validateSecurity(): void {
    const mockRequest = {
      url: this.selectedEndpoint,
      method: this.requestMethod,
      headers: {
        get: (name: string) => this.requestHeaders[name] || null
      }
    } as any;
    
    // Check if the request would be allowed
    this.securityValidation = this.networkSecurityService.validateRequest(mockRequest);
    
    // Get security details
    this.securityDetails = {
      zone: this.networkSecurityService.getSecurityZone(this.selectedEndpoint),
      policy: this.networkSecurityService.getSecurityPolicy(this.selectedEndpoint),
      userHasAccess: this.securityValidation
    };
    
    // Show notification
    this.notificationService.sendNotification({
      title: this.securityValidation ? 'Security Check Passed' : 'Security Check Failed',
      message: this.securityValidation 
        ? `Request to ${this.selectedEndpoint} would be allowed with current security context.` 
        : `Request to ${this.selectedEndpoint} would be denied with current security context.`,
      type: this.securityValidation ? 'success' : 'error',
      category: 'system'
    });
  }
  
  /**
   * Send a test request to the selected endpoint
   */
  sendRequest(): void {
    const startTime = performance.now();
    
    // Set up headers
    const headers: any = {};
    Object.keys(this.requestHeaders).forEach(key => {
      headers[key] = this.requestHeaders[key];
    });
    
    // Parse request body
    let body;
    try {
      body = JSON.parse(this.requestBody);
    } catch (e) {
      body = {};
      this.notificationService.sendNotification({
        title: 'Invalid JSON',
        message: 'Request body is not valid JSON. Using empty object instead.',
        type: 'warning',
        category: 'system'
      });
    }
    
    // Send request based on method
    let request;
    switch (this.requestMethod) {
      case 'GET':
        request = this.http.get(this.selectedEndpoint, { headers, observe: 'response' });
        break;
      case 'POST':
        request = this.http.post(this.selectedEndpoint, body, { headers, observe: 'response' });
        break;
      case 'PUT':
        request = this.http.put(this.selectedEndpoint, body, { headers, observe: 'response' });
        break;
      case 'DELETE':
        request = this.http.delete(this.selectedEndpoint, { headers, observe: 'response' });
        break;
    }
    
    // Handle response
    request.subscribe({
      next: (res: any) => {
        const endTime = performance.now();
        this.responseTime = Math.round(endTime - startTime);
        this.responseStatus = res.status;
        
        // Get response headers
        this.responseHeaders = {};
        res.headers.keys().forEach((key: string) => {
          this.responseHeaders[key] = res.headers.get(key);
        });
        
        // Set response body
        this.response = res.body;
        
        this.notificationService.sendNotification({
          title: 'Request Successful',
          message: `${this.requestMethod} request to ${this.selectedEndpoint} completed with status ${this.responseStatus} in ${this.responseTime}ms.`,
          type: 'success',
          category: 'system'
        });
      },
      error: (err: any) => {
        const endTime = performance.now();
        this.responseTime = Math.round(endTime - startTime);
        this.responseStatus = err.status;
        this.response = err.error;
        
        // Get response headers if available
        this.responseHeaders = {};
        if (err.headers) {
          err.headers.keys().forEach((key: string) => {
            this.responseHeaders[key] = err.headers.get(key);
          });
        }
        
        // Error is already handled by ErrorHandlingInterceptor
      }
    });
  }
  
  /**
   * Update headers when endpoint changes
   */
  onEndpointChange(): void {
    const endpoint = this.endpoints.find(e => e.url === this.selectedEndpoint);
    
    if (endpoint) {
      // Add zone-specific headers
      this.requestHeaders['X-Security-Zone'] = endpoint.zone;
      
      // Add audit header for admin and system zones
      if (endpoint.zone === SecurityZoneType.Admin || endpoint.zone === SecurityZoneType.System) {
        this.requestHeaders['X-Audit-Required'] = 'true';
      } else {
        delete this.requestHeaders['X-Audit-Required'];
      }
    }
  }
  
  /**
   * Add a custom header
   */
  addHeader(key: string, value: string): void {
    if (key && value) {
      this.requestHeaders[key] = value;
    }
  }
  
  /**
   * Remove a header
   */
  removeHeader(key: string): void {
    delete this.requestHeaders[key];
  }
  
  /**
   * Get CSS class for security zone
   */
  getZoneClass(zone: SecurityZoneType): string {
    switch (zone) {
      case SecurityZoneType.Public: return 'zone-public';
      case SecurityZoneType.Protected: return 'zone-protected';
      case SecurityZoneType.Secure: return 'zone-secure';
      case SecurityZoneType.Admin: return 'zone-admin';
      case SecurityZoneType.System: return 'zone-system';
    }
  }
}
