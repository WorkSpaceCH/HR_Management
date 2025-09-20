import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

// Import our new modular architecture
import { SecurityModule } from './security/security.module';
import { NetworkModule } from './network/network.module';

// We'll still need to register these interceptors during the transition period
// Later they should be moved into the NetworkModule
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MainLayoutComponent } from './components/main-layout/main-layout.component';

@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SecurityModule.forRoot(),
    NetworkModule.forRoot()
  ],
  exports: [
    MainLayoutComponent
  ],
  providers: [
    // Only register the TenantInterceptor here, as ApiInterceptor and ErrorHandlingInterceptor
    // are now registered in the NetworkModule
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
