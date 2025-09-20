import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { AccessControlComponent } from './access-control/access-control.component';

// Import feature-specific security module
import { AdminSecurityModule } from './security/admin-security.module';

// Import network module
import { AdminNetworkModule } from './network/admin-network.module';

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
    SharedModule,
    // Import and configure feature-specific security and network modules
    AdminSecurityModule.forRoot(),
    AdminNetworkModule.forRoot()
  ],
  // Ensure services from this module can't be injected elsewhere
  providers: []
  // Note: AdminModule is lazy-loaded, so its services will not be available in other modules
})
export class AdminModule { }
