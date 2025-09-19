import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HrRoutingModule } from './hr-routing.module';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PolicyManagementComponent } from './policy-management/policy-management.component';

@NgModule({
  declarations: [
    HrDashboardComponent,
    RecruitmentComponent,
    PayrollComponent,
    PolicyManagementComponent
  ],
  imports: [
    CommonModule,
    HrRoutingModule,
    SharedModule
  ]
})
export class HrModule { }
