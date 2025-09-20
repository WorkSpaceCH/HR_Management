import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { AccessControlComponent } from './access-control/access-control.component';

// Core security imports
import { AuthGuard } from '../../core/security/guards/auth.guard';
import { RoleGuard } from '../../core/security/guards/role.guard';
import { PermissionGuard } from '../../core/security/guards/permission.guard';
import { Role } from '../../core/models/user.model';

// Admin-specific security guard
import { AdminPermissionGuard } from './security/guards/admin-permission.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [AuthGuard, RoleGuard, PermissionGuard],
    data: { 
      roles: [Role.ADMIN],
      permissions: ['users:manage', 'users:view']
    }
  },
  {
    path: 'settings',
    component: SystemSettingsComponent,
    canActivate: [AuthGuard, RoleGuard, AdminPermissionGuard],
    data: { 
      roles: [Role.ADMIN],
      adminPermission: 'system:configure'
    }
  },
  {
    path: 'access-control',
    component: AccessControlComponent,
    canActivate: [AuthGuard, RoleGuard, PermissionGuard],
    data: { 
      roles: [Role.ADMIN],
      permissions: ['roles:manage', 'permissions:manage'],
      requireAllPermissions: true // Must have both permissions
    }
  },
  {
    path: 'departments',
    component: SystemSettingsComponent, 
    canActivate: [AuthGuard, RoleGuard, AdminPermissionGuard],
    data: { 
      roles: [Role.ADMIN],
      adminPermission: 'departments:manage'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
