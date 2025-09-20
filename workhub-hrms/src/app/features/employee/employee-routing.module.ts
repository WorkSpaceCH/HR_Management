import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'] }
  },
  {
    path: 'list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'] }
  },
  {
    path: 'leave-requests',
    component: LeaveRequestsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
