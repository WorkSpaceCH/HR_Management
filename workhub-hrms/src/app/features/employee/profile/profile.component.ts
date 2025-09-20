import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeService } from '../../../services/employee.service';
import { User } from '../../../core/models/user.model';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  employeeData: Employee | null = null;
  isEditing = false;
  loading = false;
  saveSuccess = false;
  saveError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadEmployeeData(user.id);
      }
    });
  }

  loadEmployeeData(userId: number): void {
    this.loading = true;
    this.employeeService.getEmployee(userId).subscribe({
      next: (employee) => {
        this.employeeData = employee;
        this.patchFormValues(employee);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employee data', err);
        this.loading = false;
      }
    });
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: [''],
      }),
      emergencyContact: this.fb.group({
        name: [''],
        relationship: [''],
        phone: [''],
      }),
      skills: [''],
      bio: ['', [Validators.maxLength(500)]]
    });
  }

  patchFormValues(employee: Employee): void {
    // In a real app, we would map the employee data to the form
    // For now, just patch the basic fields we have
    this.profileForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email
    });
    
    // Disable email field as it's typically not changeable by the employee
    this.profileForm.get('email')?.disable();
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.employeeData) {
      // Reset form when canceling edit
      this.patchFormValues(this.employeeData);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.saveSuccess = false;
    this.saveError = '';

    const updatedProfile = {
      ...this.employeeData,
      ...this.profileForm.getRawValue()
    };

    // In a real app, we'd call a service to update the profile
    // For now, simulate a successful update after a delay
    setTimeout(() => {
      this.loading = false;
      this.saveSuccess = true;
      this.employeeData = updatedProfile as Employee;
      this.isEditing = false;
      
      // Reset success message after 3 seconds
      setTimeout(() => this.saveSuccess = false, 3000);
    }, 1000);
  }
}
