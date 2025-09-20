import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Role, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  userForm: FormGroup;
  searchForm: FormGroup;
  loading = true;
  saving = false;
  showUserForm = false;
  formMode: 'add' | 'edit' = 'add';
  roles = Object.values(Role);

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.userForm = this.createUserForm();
    this.searchForm = this.fb.group({
      searchTerm: [''],
      roleFilter: ['all']
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    // Subscribe to search form changes
    this.searchForm.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      id: [null],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: [Role.EMPLOYEE, Validators.required],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      isActive: [true]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    // If creating a new user, both fields are required
    if (!g.get('id')?.value && (!password || !confirmPassword)) {
      return { 'passwordRequired': true };
    }
    
    // If either field has a value (edit mode, changing password), they must match
    if ((password || confirmPassword) && password !== confirmPassword) {
      return { 'mismatch': true };
    }
    
    return null;
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    const { searchTerm, roleFilter } = this.searchForm.value;
    
    let filtered = [...this.users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) || 
        user.firstName.toLowerCase().includes(term) || 
        user.lastName.toLowerCase().includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    this.filteredUsers = filtered;
  }

  openAddUserForm(): void {
    this.formMode = 'add';
    this.userForm.reset();
    this.userForm.patchValue({
      role: Role.EMPLOYEE,
      isActive: true
    });
    
    // Make password required for new users
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    
    this.showUserForm = true;
  }

  openEditUserForm(user: User): void {
    this.formMode = 'edit';
    
    // Reset password validators - not required in edit mode
    this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: true // Assuming all users are active for now
    });
    
    this.selectedUser = user;
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.selectedUser = null;
  }

  submitUserForm(): void {
    if (this.userForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    const userData = { ...this.userForm.value };
    
    // If empty password in edit mode, remove it
    if (this.formMode === 'edit' && !userData.password) {
      delete userData.password;
    }
    
    // Remove confirmPassword as it's not needed by the API
    delete userData.confirmPassword;

    if (this.formMode === 'add') {
      this.adminService.createUser(userData).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.filterUsers();
          this.closeUserForm();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error creating user', err);
          this.saving = false;
        }
      });
    } else {
      this.adminService.updateUser(userData.id, userData).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.filterUsers();
          }
          this.closeUserForm();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error updating user', err);
          this.saving = false;
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterUsers();
        },
        error: (err) => {
          console.error('Error deleting user', err);
        }
      });
    }
  }

  getRoleBadgeClass(role: Role): string {
    switch (role) {
      case Role.ADMIN: return 'role-admin';
      case Role.HR: return 'role-hr';
      case Role.MANAGER: return 'role-manager';
      case Role.EMPLOYEE: return 'role-employee';
      default: return '';
    }
  }
}
