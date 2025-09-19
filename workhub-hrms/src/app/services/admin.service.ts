import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../core/services/auth.service';

export interface SystemSettings {
  id: string;
  name: string;
  value: string;
  category: string;
  description?: string;
  isEditable: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  // User management
  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('admin/users');
  }

  getUser(id: number): Observable<User> {
    return this.apiService.get<User>(`admin/users/${id}`);
  }

  createUser(user: Omit<User, 'id' | 'token'>): Observable<User> {
    return this.apiService.post<User, Omit<User, 'id' | 'token'>>('admin/users', user);
  }

  updateUser(id: number, updates: Partial<User>): Observable<User> {
    return this.apiService.patch<User, Partial<User>>(`admin/users/${id}`, updates);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`admin/users/${id}`);
  }

  // System settings
  getSystemSettings(category?: string): Observable<SystemSettings[]> {
    const params = category ? { category } : {};
    return this.apiService.get<SystemSettings[]>('admin/settings', { params });
  }

  updateSystemSetting(id: string, value: string): Observable<SystemSettings> {
    return this.apiService.patch<SystemSettings, { value: string }>(`admin/settings/${id}`, { value });
  }

  // Access control
  getRoles(): Observable<Role[]> {
    return this.apiService.get<Role[]>('admin/roles');
  }

  getRole(id: number): Observable<Role> {
    return this.apiService.get<Role>(`admin/roles/${id}`);
  }

  createRole(role: Omit<Role, 'id'>): Observable<Role> {
    return this.apiService.post<Role, Omit<Role, 'id'>>('admin/roles', role);
  }

  updateRole(id: number, updates: Partial<Role>): Observable<Role> {
    return this.apiService.patch<Role, Partial<Role>>(`admin/roles/${id}`, updates);
  }

  deleteRole(id: number): Observable<void> {
    return this.apiService.delete<void>(`admin/roles/${id}`);
  }

  // Permissions
  getPermissions(): Observable<Permission[]> {
    return this.apiService.get<Permission[]>('admin/permissions');
  }

  // System information
  getSystemInfo(): Observable<any> {
    return this.apiService.get<any>('admin/system-info');
  }

  // Logs
  getSystemLogs(limit: number = 100, level?: string): Observable<any[]> {
    const params = { limit: limit.toString() };
    if (level) params['level'] = level;
    return this.apiService.get<any[]>('admin/logs', { params });
  }
}
