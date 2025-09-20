import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Department } from '../../../core/models/department.model';
import { HrService, Candidate, Policy } from '../../../services/hr.service';

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.scss']
})
export class HrDashboardComponent implements OnInit {
  loading = true;
  recruitmentStats = {
    totalCandidates: 0,
    newCandidates: 0,
    inScreening: 0,
    inInterview: 0,
    inOffer: 0,
    hired: 0,
    rejected: 0
  };
  
  activeDepartment$: Observable<Department | null>;
  recentCandidates: Candidate[] = [];
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private tenantService: TenantService,
    private hrService: HrService
  ) {
    this.activeDepartment$ = this.tenantService.activeDepartment$;
  }
  
  ngOnInit(): void {
    this.loadRecruitmentData();
  }

  loadRecruitmentData(): void {
    this.loading = true;
    this.hrService.getCandidates().subscribe({
      next: (candidates) => {
        // Calculate recruitment statistics
        this.recruitmentStats.totalCandidates = candidates.length;
        this.recruitmentStats.newCandidates = candidates.filter(c => c.status === 'new').length;
        this.recruitmentStats.inScreening = candidates.filter(c => c.status === 'screening').length;
        this.recruitmentStats.inInterview = candidates.filter(c => c.status === 'interview').length;
        this.recruitmentStats.inOffer = candidates.filter(c => c.status === 'offer').length;
        this.recruitmentStats.hired = candidates.filter(c => c.status === 'hired').length;
        this.recruitmentStats.rejected = candidates.filter(c => c.status === 'rejected').length;
        
        // Get recent candidates (last 5)
        this.recentCandidates = candidates
          .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
          .slice(0, 5);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recruitment data', err);
        this.loading = false;
      }
    });
  }

  // Helper method to get department name
  getDepartmentName(departmentId: number): string {
    // This would typically be replaced with a more efficient lookup method
    let departmentName = 'Unknown';
    this.tenantService.getDepartmentById(departmentId).subscribe(dept => {
      if (dept) {
        departmentName = dept.name;
      }
    });
    return departmentName;
  }

  // Navigation methods
  navigateToRecruitment(): void {
    this.router.navigate(['/hr/recruitment']);
  }

  navigateToPayroll(): void {
    this.router.navigate(['/hr/payroll']);
  }

  navigateToPolicies(): void {
    this.router.navigate(['/hr/policies']);
  }
}
