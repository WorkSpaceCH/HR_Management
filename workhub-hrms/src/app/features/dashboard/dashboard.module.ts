import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

// Widget components
import { EmployeeWidgetComponent } from './components/employee-widget/employee-widget.component';
import { ManagerWidgetComponent } from './components/manager-widget/manager-widget.component';
import { HrAnalyticsWidgetComponent } from './components/hr-analytics-widget/hr-analytics-widget.component';
import { AdminWidgetComponent } from './components/admin-widget/admin-widget.component';

// Services
import { DashboardService } from './services/dashboard.service';
import { DASHBOARD_SERVICE_TOKEN } from './services/dashboard.tokens';
import { ApiService } from '../../core/network/services/api.service';

@NgModule({
  declarations: [
    DashboardComponent,
    EmployeeWidgetComponent,
    ManagerWidgetComponent,
    HrAnalyticsWidgetComponent,
    AdminWidgetComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DashboardRoutingModule,
    SharedModule,
    MatTableModule,
    MatButtonModule
  ],
  providers: [
    { provide: DASHBOARD_SERVICE_TOKEN, useClass: DashboardService },
    DashboardService,
    ApiService
  ]
})
export class DashboardModule { }
