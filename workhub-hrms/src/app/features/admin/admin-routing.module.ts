import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { AccessControlComponent } from './access-control/access-control.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'settings',
    component: SystemSettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'access-control',
    component: AccessControlComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] as Role[] }
  },
  {
    path: 'departments',
    component: SystemSettingsComponent, 
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] as Role[] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
