import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Department } from '../../../core/models/department.model';
import { TenantService } from '../../../core/services/tenant.service';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-department-selector',
  templateUrl: './department-selector.component.html',
  styleUrls: ['./department-selector.component.scss']
})
export class DepartmentSelectorComponent implements OnInit, OnDestroy {
  departments$: Observable<Department[]>;
  activeDepartment: Department | null = null;
  isAdmin = false;
  private subscription = new Subscription();

  constructor(
    private tenantService: TenantService,
    private authService: AuthService
  ) {
    this.departments$ = this.tenantService.getAllDepartments();
  }

  ngOnInit(): void {
    // Subscribe to active department changes
    this.subscription.add(
      this.tenantService.activeDepartment$.subscribe(dept => {
        this.activeDepartment = dept;
      })
    );

    // Check if user is admin (can see all departments)
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.isAdmin = user?.role === Role.ADMIN || user?.role === Role.HR;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  /**
   * Handle department selection change
   */
  onDepartmentChange(event: Event): void {
    // Safely cast the event target to an HTMLSelectElement
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    
    if (!value) {
      // Handle the 'All Departments' case
      this.tenantService.clearActiveDepartment();
      return;
    }
    
    // Convert the string value to a number
    const departmentId = parseInt(value, 10);
    
    this.departments$.subscribe(departments => {
      const selected = departments.find(dept => dept.id === departmentId);
      if (selected) {
        this.tenantService.setActiveDepartment(selected);
      }
    }).unsubscribe();
  }

  /**
   * Clear active department selection (view all)
   */
  clearDepartmentSelection(): void {
    this.tenantService.clearActiveDepartment();
  }
}
