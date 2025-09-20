import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../../core/network/services/api.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  /**
   * Get employee dashboard data
   */
  getEmployeeDashboard(): Observable<any> {
    // For demo, we'll use mock data
    // In production, this would call: return this.apiService.get('employee/dashboard');
    return of({
      profile: {
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'Engineering',
        joinDate: '2024-01-15'
      },
      leaveBalance: {
        annual: 20,
        sick: 10,
        used: 5
      },
      upcomingHolidays: [
        { name: 'Independence Day', date: '2025-08-15' },
        { name: 'Diwali', date: '2025-11-12' }
      ],
      pendingTasks: [
        { id: 1, title: 'Complete performance review', deadline: '2025-10-10' },
        { id: 2, title: 'Submit quarterly goals', deadline: '2025-10-15' }
      ],
      announcements: [
        { id: 1, title: 'Company Townhall Next Week', date: '2025-09-18', important: true },
        { id: 2, title: 'New Health Insurance Provider', date: '2025-09-15', important: false }
      ]
    });
  }

  /**
   * Get manager dashboard data
   */
  getManagerDashboard(): Observable<any> {
    // For demo, we'll use mock data
    return of({
      teamSize: 8,
      pendingApprovals: [
        { id: 1, type: 'Leave Request', employee: 'Alice Brown', submittedDate: '2025-09-18' },
        { id: 2, type: 'Expense Report', employee: 'Bob Johnson', submittedDate: '2025-09-17' }
      ],
      teamAttendance: {
        present: 7,
        absent: 1,
        onLeave: 0,
        percentage: 87.5
      },
      teamPerformance: {
        excellent: 3,
        good: 4,
        average: 1,
        needsImprovement: 0
      },
      upcomingReviews: [
        { id: 1, employee: 'Charlie Davis', dueDate: '2025-10-01' },
        { id: 2, employee: 'Diana Evans', dueDate: '2025-10-05' }
      ]
    });
  }

  /**
   * Get HR dashboard data
   */
  getHRDashboard(): Observable<any> {
    // For demo, we'll use mock data
    return of({
      employeeCount: 126,
      departmentBreakdown: [
        { department: 'Engineering', count: 45 },
        { department: 'Sales', count: 32 },
        { department: 'Marketing', count: 18 },
        { department: 'HR', count: 8 },
        { department: 'Finance', count: 12 },
        { department: 'Operations', count: 11 }
      ],
      recentHires: [
        { id: 1, name: 'Frank Green', position: 'UX Designer', department: 'Engineering', joinDate: '2025-09-01' },
        { id: 2, name: 'Grace Hill', position: 'Sales Representative', department: 'Sales', joinDate: '2025-08-25' }
      ],
      openPositions: [
        { id: 1, title: 'Senior Backend Developer', department: 'Engineering', applications: 12 },
        { id: 2, title: 'Marketing Specialist', department: 'Marketing', applications: 8 }
      ],
      turnoverRate: {
        monthly: 1.2,
        quarterly: 3.5,
        yearly: 12.0
      }
    });
  }

  /**
   * Get admin dashboard data
   */
  getAdminDashboard(): Observable<any> {
    // For demo, we'll use mock data
    return of({
      systemHealth: {
        cpu: 35,
        memory: 42,
        storage: 58,
        status: 'Healthy'
      },
      activeUsers: {
        total: 98,
        lastHour: 78,
        mobile: 34
      },
      securityAlerts: [
        { id: 1, type: 'Failed Login Attempts', count: 5, severity: 'Medium' },
        { id: 2, type: 'Permission Changes', count: 2, severity: 'Low' }
      ],
      recentUpdates: [
        { id: 1, component: 'Payroll Module', version: '2.3.1', date: '2025-09-10' },
        { id: 2, component: 'Recruitment System', version: '1.7.0', date: '2025-09-05' }
      ]
    });
  }

  /**
   * Get analytics data for charts and metrics
   */
  getAnalyticsData(): Observable<any> {
    // For demo, we'll use mock data
    return of({
      employeeDistribution: [
        { department: 'Engineering', count: 45 },
        { department: 'Sales', count: 32 },
        { department: 'Marketing', count: 18 },
        { department: 'HR', count: 8 },
        { department: 'Finance', count: 12 },
        { department: 'Operations', count: 11 }
      ],
      attendanceTrend: [
        { date: 'Sep 14', percentage: 92 },
        { date: 'Sep 15', percentage: 88 },
        { date: 'Sep 16', percentage: 91 },
        { date: 'Sep 17', percentage: 87 },
        { date: 'Sep 18', percentage: 85 },
        { date: 'Sep 19', percentage: 83 },
        { date: 'Sep 20', percentage: 90 }
      ],
      recentActivities: [
        { user: 'Admin', action: 'Updated system settings', timestamp: '2025-09-20T10:30:00' },
        { user: 'HR Manager', action: 'Added new job position', timestamp: '2025-09-20T09:45:00' },
        { user: 'System', action: 'Database backup completed', timestamp: '2025-09-20T09:00:00' },
        { user: 'HR Assistant', action: 'Processed 5 leave requests', timestamp: '2025-09-19T16:20:00' },
        { user: 'Admin', action: 'Modified user permissions', timestamp: '2025-09-19T14:15:00' }
      ],
      departmentMetrics: [
        { department: 'Engineering', headcount: 45, openPositions: 3, turnoverRate: 8.2 },
        { department: 'Sales', headcount: 32, openPositions: 2, turnoverRate: 12.5 },
        { department: 'Marketing', headcount: 18, openPositions: 1, turnoverRate: 5.1 },
        { department: 'HR', headcount: 8, openPositions: 0, turnoverRate: 0 },
        { department: 'Finance', headcount: 12, openPositions: 1, turnoverRate: 7.7 }
      ],
      recruitmentMetrics: [
        { position: 'Software Engineer', applicants: 56, interviewed: 12, hired: 3 },
        { position: 'Sales Representative', applicants: 42, interviewed: 15, hired: 4 },
        { position: 'UX Designer', applicants: 38, interviewed: 8, hired: 2 },
        { position: 'Product Manager', applicants: 24, interviewed: 6, hired: 1 },
        { position: 'Marketing Specialist', applicants: 32, interviewed: 9, hired: 2 }
      ]
    });
  }
}
