import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TeamManagementComponent } from './team-management/team-management.component';
import { LeaveApprovalComponent } from './leave-approval/leave-approval.component';

@NgModule({
  declarations: [
    ManagerDashboardComponent,
    TeamManagementComponent,
    LeaveApprovalComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule { }
