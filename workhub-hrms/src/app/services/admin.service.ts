import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Role, User } from '../core/models/user.model';
import { MOCK_USERS } from '../core/data/mock-users';

export interface SystemSettings {
  companyName: string;
  emailDomain: string;
  defaultLanguage: string;
  dateFormat: string;
  timeZone: string;
  maintenanceMode: boolean;
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
}

export interface RoleDefinition {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  action: 'read' | 'create' | 'update' | 'delete' | 'approve';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private basePath = 'admin';
  private mockUsers: User[] = [...MOCK_USERS];
  
  constructor(private apiService: ApiService) {}

  // User Management endpoints
  getUsers(): Observable<User[]> {
    // For development, return mock data
    return of(this.mockUsers).pipe(delay(500));
    
    // For production, use the API service
    // return this.apiService.get<User[]>(`${this.basePath}/users`);
  }

  getUser(id: number): Observable<User> {
    // For development, use mock data
    return of(this.mockUsers.find(u => u.id === id)!).pipe(delay(300));
    
    // For production, use the API service
    // return this.apiService.get<User>(`${this.basePath}/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    // For development, create a user with a generated ID
    const newUser = {
      ...user,
      id: this.mockUsers.length > 0 ? 
          Math.max(...this.mockUsers.map(u => u.id)) + 1 : 1
    } as User;
    
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(800));
    
    // For production, use the API service
    // return this.apiService.post<User, Omit<User, 'id'>>(`${this.basePath}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    // For development, update an existing user
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...user };
      return of(this.mockUsers[index]).pipe(delay(800));
    }
    return of(null!).pipe(
      delay(300),
      map(() => { throw new Error('User not found'); })
    );
    
    // For production, use the API service
    // return this.apiService.patch<User, Partial<User>>(`${this.basePath}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    // For development, remove a user from the mock array
    const initialLength = this.mockUsers.length;
    this.mockUsers = this.mockUsers.filter(u => u.id !== id);
    
    if (this.mockUsers.length === initialLength) {
      return of(null!).pipe(
        delay(300),
        map(() => { throw new Error('User not found'); })
      );
    }
    
    return of(undefined).pipe(delay(800));
    
    // For production, use the API service
    // return this.apiService.delete<void>(`${this.basePath}/users/${id}`);
  }

  // System settings
  private mockSystemSettings: SystemSettings = {
    companyName: 'WorkHub HRMS',
    emailDomain: 'workhub.com',
    defaultLanguage: 'en-US',
    dateFormat: 'MM/dd/yyyy',
    timeZone: 'UTC',
    maintenanceMode: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expiryDays: 90
    }
  };
  
  getSystemSettings(): Observable<SystemSettings> {
    // For development, return mock data
    return of(this.mockSystemSettings).pipe(delay(500));
    
    // For production, use the API service
    // return this.apiService.get<SystemSettings>(`${this.basePath}/settings`);
  }

  updateSystemSettings(settings: Partial<SystemSettings>): Observable<SystemSettings> {
    // For development, update mock settings
    this.mockSystemSettings = {
      ...this.mockSystemSettings,
      ...settings
    };
    return of(this.mockSystemSettings).pipe(delay(800));
    
    // For production, use the API service
    // return this.apiService.patch<SystemSettings, Partial<SystemSettings>>(`${this.basePath}/settings`, settings);
  }

  // Role Management endpoints
  private mockRoles: RoleDefinition[] = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'HR Manager',
      description: 'Access to HR functions and reports',
      permissions: ['users:read', 'users:create', 'hr:full', 'reports:read']
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Team management capabilities',
      permissions: ['team:full', 'leaves:approve', 'reports:team']
    },
    {
      id: 4,
      name: 'Employee',
      description: 'Basic employee access',
      permissions: ['profile:read', 'profile:update', 'leaves:request']
    }
  ];
  
  getRoles(): Observable<RoleDefinition[]> {
    return of(this.mockRoles).pipe(delay(500));
  }

  getRole(id: number): Observable<RoleDefinition> {
    return of(this.mockRoles.find(r => r.id === id)!).pipe(delay(300));
  }

  createRole(role: Omit<RoleDefinition, 'id'>): Observable<RoleDefinition> {
    const newRole = {
      ...role,
      id: this.mockRoles.length > 0 ? 
          Math.max(...this.mockRoles.map(r => r.id)) + 1 : 1
    } as RoleDefinition;
    
    this.mockRoles.push(newRole);
    return of(newRole).pipe(delay(800));
  }

  updateRole(id: number, role: Partial<RoleDefinition>): Observable<RoleDefinition> {
    const index = this.mockRoles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.mockRoles[index] = { ...this.mockRoles[index], ...role };
      return of(this.mockRoles[index]).pipe(delay(800));
    }
    return of(null!).pipe(map(() => { throw new Error('Role not found'); }));
  }

  deleteRole(id: number): Observable<void> {
    const initialLength = this.mockRoles.length;
    this.mockRoles = this.mockRoles.filter(r => r.id !== id);
    
    if (this.mockRoles.length === initialLength) {
      return of(null!).pipe(map(() => { throw new Error('Role not found'); }));
    }
    
    return of(undefined).pipe(delay(800));
  }

  // Permission Management endpoints
  private mockPermissions: Permission[] = [
    { id: 1, name: 'users:read', description: 'View users', module: 'Users', action: 'read' },
    { id: 2, name: 'users:create', description: 'Create users', module: 'Users', action: 'create' },
    { id: 3, name: 'users:update', description: 'Update users', module: 'Users', action: 'update' },
    { id: 4, name: 'users:delete', description: 'Delete users', module: 'Users', action: 'delete' },
    { id: 5, name: 'hr:full', description: 'Full HR access', module: 'HR', action: 'read' },
    { id: 6, name: 'team:full', description: 'Full team management', module: 'Team', action: 'read' },
    { id: 7, name: 'leaves:request', description: 'Request leaves', module: 'Leaves', action: 'create' },
    { id: 8, name: 'leaves:approve', description: 'Approve leaves', module: 'Leaves', action: 'approve' },
    { id: 9, name: 'reports:read', description: 'View reports', module: 'Reports', action: 'read' },
    { id: 10, name: 'reports:team', description: 'View team reports', module: 'Reports', action: 'read' }
  ];
  
  getPermissions(): Observable<Permission[]> {
    return of(this.mockPermissions).pipe(delay(500));
  }

  // System Information endpoints
  getSystemInfo(): Observable<any> {
    return of({
      version: '1.0.0',
      serverTime: new Date(),
      uptime: '3 days, 5 hours',
      lastBackup: '2025-09-19 02:00:00',
      dbSize: '256 MB',
      activeUsers: 15,
      environment: 'Development',
      nodeVersion: 'v16.14.2',
      memoryUsage: '42%',
      cpuUsage: '28%',
      operatingSystem: 'Linux'
    }).pipe(delay(500));
  }

  // Logs
  getSystemLogs(limit: number = 100, level?: string): Observable<any[]> {
    // For development, return mock data
    return of([
      { timestamp: '2025-09-19T08:15:22Z', level: 'info', message: 'User admin logged in', source: 'auth.service' },
      { timestamp: '2025-09-19T08:14:55Z', level: 'info', message: 'Application started', source: 'app.service' },
      { timestamp: '2025-09-19T07:45:12Z', level: 'warn', message: 'Failed login attempt for user john', source: 'auth.service' },
      { timestamp: '2025-09-19T07:30:05Z', level: 'error', message: 'Database connection timeout', source: 'db.service' },
      { timestamp: '2025-09-19T07:15:33Z', level: 'info', message: 'Backup completed successfully', source: 'backup.service' }
    ].filter(log => !level || log.level === level).slice(0, limit))
      .pipe(delay(500));
    
    // For production, use the API service with HttpParams
    // const options = { params: new HttpParams().set('limit', limit.toString()) };
    // if (level) options.params = options.params.set('level', level);
    // return this.apiService.get<any[]>('admin/logs', options);
  }
}
