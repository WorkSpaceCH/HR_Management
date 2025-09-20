/**
 * Environment configuration for development environment
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // Base API URL for development
  
  // Security settings
  security: {
    tokenExpiryMinutes: 60,    // JWT token expiry in minutes
    sessionTimeoutMinutes: 30, // User session timeout
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    mfa: {
      enabled: false, // Multi-factor authentication
      providers: ['email'] // MFA providers: 'email', 'sms', 'authenticator'
    }
  },
  
  // API endpoints by module
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refreshToken: '/auth/refresh-token',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password'
    },
    employee: {
      base: '/employees',
      profile: '/employees/profile',
      leave: '/employees/leave'
    },
    manager: {
      team: '/manager/team',
      approvals: '/manager/approvals'
    },
    hr: {
      employees: '/hr/employees',
      onboarding: '/hr/onboarding',
      offboarding: '/hr/offboarding'
    },
    admin: {
      users: '/admin/users',
      departments: '/admin/departments',
      roles: '/admin/roles',
      permissions: '/admin/permissions'
    }
  },
  
  // Feature flags
  features: {
    notifications: true,
    realTimeUpdates: true,
    fileUpload: true,
    exportReports: true,
    advancedSearch: true
  }
};
