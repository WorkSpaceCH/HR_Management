import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSecurityService } from './services/admin-security.service';
import { AdminPermissionGuard } from './guards/admin-permission.guard';

/**
 * Admin Security Module
 * 
 * This module isolates security concerns specific to the Admin feature
 * It provides its own guards and services that are only accessible within the Admin module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class AdminSecurityModule {
  static forRoot(): ModuleWithProviders<AdminSecurityModule> {
    return {
      ngModule: AdminSecurityModule,
      providers: [
        AdminSecurityService,
        AdminPermissionGuard
      ]
    };
  }
}
