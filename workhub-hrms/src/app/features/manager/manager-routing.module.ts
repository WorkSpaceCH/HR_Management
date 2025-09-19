import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TeamManagementComponent } from './team-management/team-management.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ManagerDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager', 'hr', 'admin'] }
  },
  {
    path: 'team',
    component: TeamManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager', 'hr', 'admin'] }
  },
  {
    path: 'leave-approval',
    component: LeaveApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: ['manager', 'hr', 'admin'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
