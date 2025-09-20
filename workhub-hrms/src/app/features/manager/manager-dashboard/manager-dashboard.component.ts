import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { EmployeeService } from '../../../services/employee.service';
import { User } from '../../../core/models/user.model';
import { Department } from '../../../core/models/department.model';
import { Employee } from '../../../core/models/employee.model';

interface TeamMetrics {
  totalTeamMembers: number;
  activeMembers: number;
  onLeaveMembers: number;
  newHires: number;
  pendingReviews: number;
}

interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  status: string;
  type: string;
}

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  activeDepartment$: Observable<Department | null>;
  teamMetrics: TeamMetrics = {
    totalTeamMembers: 0,
    activeMembers: 0,
    onLeaveMembers: 0,
    newHires: 0,
    pendingReviews: 3 // Mock data
  };
  recentLeaveRequests: LeaveRequest[] = [];
  teamMembers: Employee[] = [];
  loading = true;
  currentDate = new Date();

  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private employeeService: EmployeeService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.activeDepartment$ = this.tenantService.activeDepartment$;
  }

  ngOnInit(): void {
    // Load team members to calculate metrics
    this.loadTeamData();
    
    // Load mock leave requests
    this.loadMockLeaveRequests();
  }

  loadTeamData(): void {
    this.loading = true;
    
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.employeeService.getEmployees().subscribe({
          next: (employees) => {
            // Filter employees that report to the current manager
            this.teamMembers = employees.filter(emp => emp.managerId === user.id);
            
            // Calculate metrics
            this.calculateTeamMetrics();
            
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading team data', err);
            this.loading = false;
          }
        });
      }
    });
  }

  calculateTeamMetrics(): void {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    
    this.teamMetrics.totalTeamMembers = this.teamMembers.length;
    this.teamMetrics.activeMembers = this.teamMembers.filter(emp => emp.status === 'active').length;
    this.teamMetrics.onLeaveMembers = this.teamMembers.filter(emp => emp.status === 'on_leave').length;
    
    // Count employees hired in the last 3 months
    this.teamMetrics.newHires = this.teamMembers.filter(emp => {
      const hireDate = new Date(emp.hireDate);
      return hireDate >= threeMonthsAgo;
    }).length;
  }

  loadMockLeaveRequests(): void {
    // Mock data for leave requests
    this.recentLeaveRequests = [
      {
        id: 1,
        employeeName: 'Jennifer Taylor',
        startDate: new Date(2025, 9, 22),
        endDate: new Date(2025, 9, 25),
        status: 'pending',
        type: 'vacation'
      },
      {
        id: 2,
        employeeName: 'Emma Lewis',
        startDate: new Date(2025, 9, 28),
        endDate: new Date(2025, 10, 2),
        status: 'pending',
        type: 'sick'
      },
      {
        id: 3,
        employeeName: 'Olivia Lee',
        startDate: new Date(2025, 10, 5),
        endDate: new Date(2025, 10, 12),
        status: 'pending',
        type: 'vacation'
      }
    ];
  }
}
