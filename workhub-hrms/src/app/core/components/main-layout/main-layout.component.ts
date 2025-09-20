import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TenantService } from '../../services/tenant.service';
import { User, Role } from '../../models/user.model';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser$: Observable<User | null>;
  activeDepartment$: Observable<Department | null>;
  isMenuOpen = false;
  
  // Make Role enum available to the template
  Role = Role;

  constructor(
    private authService: AuthService,
    private tenantService: TenantService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.activeDepartment$ = this.tenantService.activeDepartment$;
  }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
