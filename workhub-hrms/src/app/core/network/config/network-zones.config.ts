/**
 * Network Zones Configuration
 * 
 * Defines security zones for the application with their specific policies
 * This helps simulate zone-based package security by organizing services
 * into secure modules with their own policies and permissions
 */

// Security zone types
export enum SecurityZoneType {
  Public = 'public',      // Publicly accessible without authentication
  Protected = 'protected', // Requires authentication but minimal permission checks
  Secure = 'secure',      // Requires authentication and permission checks
  Admin = 'admin',        // Requires admin role and permission checks
  System = 'system'       // Internal system operations, highest security
}

// Security zone policy interface
export interface SecurityZonePolicy {
  requiresAuth: boolean;
  requiresPermissionCheck: boolean;
  requiresAudit: boolean;
  allowExternalAccess: boolean;
  rateLimitPerMinute: number;
  tokenLifetimeMinutes: number;
  csrfProtection: boolean;
  encryptPayload: boolean;
}

// Defined security zones with their policies
export const SecurityZones: { [key in SecurityZoneType]: SecurityZonePolicy } = {
  [SecurityZoneType.Public]: {
    requiresAuth: false,
    requiresPermissionCheck: false,
    requiresAudit: false,
    allowExternalAccess: true,
    rateLimitPerMinute: 60,
    tokenLifetimeMinutes: 0, // No token needed
    csrfProtection: false,
    encryptPayload: false
  },
  
  [SecurityZoneType.Protected]: {
    requiresAuth: true,
    requiresPermissionCheck: false,
    requiresAudit: false,
    allowExternalAccess: true,
    rateLimitPerMinute: 30,
    tokenLifetimeMinutes: 60,
    csrfProtection: true,
    encryptPayload: false
  },
  
  [SecurityZoneType.Secure]: {
    requiresAuth: true,
    requiresPermissionCheck: true,
    requiresAudit: true,
    allowExternalAccess: false,
    rateLimitPerMinute: 20,
    tokenLifetimeMinutes: 30,
    csrfProtection: true,
    encryptPayload: false
  },
  
  [SecurityZoneType.Admin]: {
    requiresAuth: true,
    requiresPermissionCheck: true,
    requiresAudit: true,
    allowExternalAccess: false,
    rateLimitPerMinute: 10,
    tokenLifetimeMinutes: 15,
    csrfProtection: true,
    encryptPayload: true
  },
  
  [SecurityZoneType.System]: {
    requiresAuth: true,
    requiresPermissionCheck: true,
    requiresAudit: true,
    allowExternalAccess: false,
    rateLimitPerMinute: 5,
    tokenLifetimeMinutes: 5,
    csrfProtection: true,
    encryptPayload: true
  }
};

// Map API endpoints to security zones
export const EndpointSecurityZones: {[key: string]: SecurityZoneType} = {
  // Public zone endpoints
  '/auth/login': SecurityZoneType.Public,
  '/auth/register': SecurityZoneType.Public,
  '/auth/forgot-password': SecurityZoneType.Public,
  
  // Protected zone endpoints
  '/api/employees/profile': SecurityZoneType.Protected,
  '/api/employees/dashboard': SecurityZoneType.Protected,
  '/api/notifications': SecurityZoneType.Protected,
  
  // Secure zone endpoints
  '/api/employees': SecurityZoneType.Secure,
  '/api/manager': SecurityZoneType.Secure,
  '/api/hr': SecurityZoneType.Secure,
  '/api/departments': SecurityZoneType.Secure,
  
  // Admin zone endpoints
  '/api/admin/users': SecurityZoneType.Admin,
  '/api/admin/roles': SecurityZoneType.Admin,
  '/api/admin/permissions': SecurityZoneType.Admin,
  '/api/admin/departments': SecurityZoneType.Admin,
  
  // System zone endpoints
  '/api/system/config': SecurityZoneType.System,
  '/api/system/audit': SecurityZoneType.System,
  '/api/system/backup': SecurityZoneType.System,
  '/api/system/logs': SecurityZoneType.System
};

/**
 * Get security zone for a specific endpoint
 */
export function getEndpointSecurityZone(url: string): SecurityZoneType {
  // Find the matching endpoint pattern
  const matchingEndpoint = Object.keys(EndpointSecurityZones)
    .find(endpoint => url.includes(endpoint));
  
  // Return the security zone or default to Secure
  return matchingEndpoint 
    ? EndpointSecurityZones[matchingEndpoint]
    : SecurityZoneType.Secure;
}

/**
 * Get security policy for a specific URL
 */
export function getSecurityPolicyForUrl(url: string): SecurityZonePolicy {
  const zoneType = getEndpointSecurityZone(url);
  return SecurityZones[zoneType];
}
