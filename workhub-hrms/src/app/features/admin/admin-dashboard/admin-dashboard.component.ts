import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { TenantService } from '../../../core/services/tenant.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  systemStats = {
    totalUsers: 0,
    activeDepartments: 0,
    totalRoles: 4, // Admin, HR, Manager, Employee
    pendingRequests: 0
  };
  
  recentUsers: any[] = [];
  systemStatus = {
    cpu: '28%',
    memory: '42%',
    storage: '65%',
    lastBackup: '2025-09-18 02:00:00',
    status: 'Healthy'
  };

  constructor(
    private router: Router,
    private adminService: AdminService,
    private tenantService: TenantService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSystemData();
  }

  loadSystemData(): void {
    this.loading = true;
    
    // Load department count
    this.tenantService.getAllDepartments().subscribe(departments => {
      this.systemStats.activeDepartments = departments.filter(d => d.isActive).length;
    });
    
    // Load users (in a real app, this would come from AdminService)
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.systemStats.totalUsers = users.length;
        
        // Get recent users (last 5)
        this.recentUsers = users
          .sort((a, b) => b.id - a.id) // Sort by ID (newest first in mock data)
          .slice(0, 5);
          
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
    
    // Load pending requests (mock data)
    this.systemStats.pendingRequests = 3;
  }

  // Navigation methods
  navigateToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToSystemSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  navigateToAccessControl(): void {
    this.router.navigate(['/admin/access-control']);
  }
  
  navigateToDepartmentManagement(): void {
    this.router.navigate(['/admin/departments']);
  }
}
