import { Component, OnInit } from '@angular/core';
import { SecurityContextService } from '../../core/security/services/security-context.service';
import { DashboardService } from './services/dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // User context
  currentUser: any;
  userRole: string = '';
  isLoading: boolean = true;
  
  // Dashboard data
  dashboardData: any = {};
  
  // Widget visibility flags
  showEmployeeWidget: boolean = false;
  showManagerWidget: boolean = false;
  showHRWidget: boolean = false;
  showAdminWidget: boolean = false;
  showAnalyticsWidget: boolean = false;
  
  // Analytics data
  employeeDistributionData: any[] = [];
  attendanceData: any[] = [];
  recentActivities: any[] = [];
  departmentMetrics: any[] = [];
  recruitmentMetrics: any[] = [];
  
  // Chart configuration
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#6b48ff', '#12939A']
  };
  
  constructor(
    private securityContext: SecurityContextService,
    private dashboardService: DashboardService
  ) {}
  
  ngOnInit(): void {
    this.loadUserContext();
    this.loadDashboardData();
  }
  
  /**
   * Load user context and determine visible widgets
   */
  private loadUserContext(): void {
    this.currentUser = this.securityContext.getCurrentUser();
    
    if (this.currentUser) {
      this.userRole = this.currentUser.role;
      
      // Determine which widgets to show based on role
      this.showEmployeeWidget = true; // All users see employee widget
      this.showManagerWidget = ['MANAGER', 'HR', 'ADMIN'].includes(this.userRole);
      this.showHRWidget = ['HR', 'ADMIN'].includes(this.userRole);
      this.showAdminWidget = this.userRole === 'ADMIN';
      this.showAnalyticsWidget = ['HR', 'ADMIN'].includes(this.userRole);
    }
  }
  
  /**
   * Load dashboard data based on user role
   */
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Define which data to load based on role
    const requests: any = {};
    
    // Basic employee data for all users
    requests.employeeData = this.dashboardService.getEmployeeDashboard();
    
    // Additional data based on role
    if (this.showManagerWidget) {
      requests.managerData = this.dashboardService.getManagerDashboard();
    }
    
    if (this.showHRWidget) {
      requests.hrData = this.dashboardService.getHRDashboard();
    }
    
    if (this.showAdminWidget) {
      requests.adminData = this.dashboardService.getAdminDashboard();
    }
    
    // Analytics data if needed
    if (this.showAnalyticsWidget) {
      requests.analyticsData = this.dashboardService.getAnalyticsData();
    }
    
    // Execute all requests in parallel
    forkJoin(requests).subscribe({
      next: (results) => {
        this.dashboardData = results;
        this.prepareAnalyticsData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data', error);
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Prepare analytics data for charts
   */
  private prepareAnalyticsData(): void {
    if (this.dashboardData.analyticsData) {
      const analytics = this.dashboardData.analyticsData;
      
      // Employee distribution by department
      this.employeeDistributionData = analytics.employeeDistribution.map((item: any) => {
        return {
          name: item.department,
          value: item.count
        };
      });
      
      // Attendance data
      this.attendanceData = [
        {
          name: 'Attendance Trends',
          series: analytics.attendanceTrend.map((item: any) => {
            return {
              name: item.date,
              value: item.percentage
            };
          })
        }
      ];
      
      // Recent activities
      this.recentActivities = analytics.recentActivities || [];
      
      // Department metrics
      this.departmentMetrics = analytics.departmentMetrics || [];
      
      // Recruitment metrics
      this.recruitmentMetrics = analytics.recruitmentMetrics || [];
    }
  }
  
  /**
   * Format date for display
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
}
