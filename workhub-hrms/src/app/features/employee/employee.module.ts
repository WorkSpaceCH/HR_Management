import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';

@NgModule({
  declarations: [
    EmployeeDashboardComponent,
    ProfileComponent,
    LeaveRequestsComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeModule { }
