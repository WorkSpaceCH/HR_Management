import { InjectionToken } from '@angular/core';
import { DashboardService } from './dashboard.service';

export const DASHBOARD_SERVICE_TOKEN = new InjectionToken<DashboardService>('DashboardService');
