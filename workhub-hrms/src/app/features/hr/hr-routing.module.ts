import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PolicyManagementComponent } from './policy-management/policy-management.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: HrDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.HR, Role.ADMIN] }
  },
  {
    path: 'recruitment',
    component: RecruitmentComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.HR, Role.ADMIN] }
  },
  {
    path: 'payroll',
    component: PayrollComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.HR, Role.ADMIN] }
  },
  {
    path: 'policies',
    component: PolicyManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.HR, Role.ADMIN] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
