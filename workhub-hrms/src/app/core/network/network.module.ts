import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { ApiService } from './services/api.service';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { NetworkSecurityService } from './services/network-security.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: []
})
export class NetworkModule {
  static forRoot(): ModuleWithProviders<NetworkModule> {
    return {
      ngModule: NetworkModule,
      providers: [
        ApiService,
        NetworkSecurityService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorHandlingInterceptor,
          multi: true
        }
      ]
    };
  }
}
