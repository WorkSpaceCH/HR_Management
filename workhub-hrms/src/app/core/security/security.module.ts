import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SecurityContextService } from './services/security-context.service';
import { SessionService } from './services/session.service';
import { PermissionService } from './services/permission.service';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

/**
 * Security Module - Handles authentication, authorization, and security features
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class SecurityModule {
  static forRoot(): ModuleWithProviders<SecurityModule> {
    return {
      ngModule: SecurityModule,
      providers: [
        AuthService,
        SecurityContextService,
        SessionService,
        PermissionService,
        RoleGuard,
        AuthGuard,
        PermissionGuard
      ]
    };
  }
}
