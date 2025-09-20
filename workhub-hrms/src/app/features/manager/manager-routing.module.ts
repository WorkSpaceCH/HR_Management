import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TeamManagementComponent } from './team-management/team-management.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: ManagerDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.MANAGER, Role.HR, Role.ADMIN] }
  },
  {
    path: 'team',
    component: TeamManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.MANAGER, Role.HR, Role.ADMIN] }
  },
  {
    path: 'leaves',
    component: LeaveApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.MANAGER, Role.HR, Role.ADMIN] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
