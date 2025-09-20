import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from './services/admin-api.service';
import { AdminHttpInterceptor } from './interceptors/admin-http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * Admin Network Module
 * 
 * Feature-specific network module that handles admin-specific API concerns
 * This is an example of module isolation - this module is only available in the Admin module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: []
})
export class AdminNetworkModule {
  static forRoot(): ModuleWithProviders<AdminNetworkModule> {
    return {
      ngModule: AdminNetworkModule,
      providers: [
        AdminApiService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AdminHttpInterceptor,
          multi: true
        }
      ]
    };
  }
}
