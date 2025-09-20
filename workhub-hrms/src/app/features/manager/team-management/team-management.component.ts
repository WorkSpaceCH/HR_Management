import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeService } from '../../../services/employee.service';
import { TenantService } from '../../../core/services/tenant.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee } from '../../../core/models/employee.model';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss']
})
export class TeamManagementComponent implements OnInit {
  teamMembers: Employee[] = [];
  filteredMembers: Employee[] = [];
  selectedEmployee: Employee | null = null;
  activeDepartment: Department | null = null;
  loading = true;
  searchForm: FormGroup;
  performanceForm: FormGroup;
  isPerformanceModalOpen = false;
  submitSuccess = false;
  currentManagerId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private tenantService: TenantService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      filterBy: ['all']
    });

    this.performanceForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewPeriod: ['', Validators.required],
      strengths: ['', Validators.required],
      improvements: ['', Validators.required],
      comments: [''],
      goals: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get current manager ID
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentManagerId = user.id;
        this.loadTeamMembers();
      }
    });

    // Listen to department changes
    this.tenantService.activeDepartment$.subscribe(dept => {
      this.activeDepartment = dept;
      if (this.teamMembers.length > 0) {
        this.filterTeamMembers();
      }
    });

    // Listen to search/filter changes
    this.searchForm.valueChanges.subscribe(() => {
      this.filterTeamMembers();
    });
  }

  loadTeamMembers(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        // Filter employees that report to the current manager
        if (this.currentManagerId) {
          this.teamMembers = employees.filter(emp => emp.managerId === this.currentManagerId);
        } else {
          // For demo purposes, show all employees if we don't have manager ID
          this.teamMembers = employees;
        }
        
        this.filterTeamMembers();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading team members', err);
        this.loading = false;
      }
    });
  }

  filterTeamMembers(): void {
    const { searchTerm, filterBy } = this.searchForm.value;
    let filtered = [...this.teamMembers];
    
    // Filter by department if one is selected
    if (this.activeDepartment) {
      filtered = filtered.filter(emp => emp.departmentId === this.activeDepartment!.id);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(term) || 
        emp.lastName.toLowerCase().includes(term) || 
        emp.email.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(emp => emp.status === filterBy);
    }
    
    this.filteredMembers = filtered;
  }

  viewEmployeeDetails(employee: Employee): void {
    this.selectedEmployee = employee;
  }

  closeEmployeeDetails(): void {
    this.selectedEmployee = null;
  }

  openPerformanceReview(employee: Employee): void {
    this.selectedEmployee = employee;
    this.isPerformanceModalOpen = true;
  }

  closePerformanceModal(): void {
    this.isPerformanceModalOpen = false;
    this.performanceForm.reset();
  }

  submitPerformanceReview(): void {
    if (this.performanceForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.performanceForm.controls).forEach(key => {
        this.performanceForm.get(key)?.markAsTouched();
      });
      return;
    }

    // In a real application, we would submit this to an API
    // For now, simulate a successful submission
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.submitSuccess = true;
      
      setTimeout(() => {
        this.closePerformanceModal();
        this.submitSuccess = false;
      }, 2000);
    }, 1000);
  }

  getDepartmentName(departmentId: number): Observable<string> {
    return this.tenantService.getDepartmentById(departmentId).pipe(
      map((dept: Department | undefined) => dept?.name || 'Unknown')
    );
  }
}
