import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { AccessControlComponent } from './access-control/access-control.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    SystemSettingsComponent,
    AccessControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
