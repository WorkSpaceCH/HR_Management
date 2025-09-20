import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Employee } from '../../../core/models/employee.model';
import { Department } from '../../../core/models/department.model';
import { EmployeeService } from '../../../services/employee.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]>;
  activeDepartment$: Observable<Department | null>;
  loading = true;
  private subscription = new Subscription();

  constructor(
    private employeeService: EmployeeService,
    private tenantService: TenantService
  ) {
    this.activeDepartment$ = this.tenantService.activeDepartment$;
    
    // Automatically refresh employees when tenant changes
    this.employees$ = this.tenantService.activeDepartment$.pipe(
      startWith(null), // Start with null to trigger initial load
      switchMap(() => {
        this.loading = true;
        return this.employeeService.getEmployees().pipe(
          map(employees => {
            this.loading = false;
            return employees;
          })
        );
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Get department name by ID
   */
  getDepartmentName(departmentId: number): Observable<string> {
    return this.tenantService.getDepartmentById(departmentId).pipe(
      map(dept => dept?.name || 'Unknown')
    );
  }
}
