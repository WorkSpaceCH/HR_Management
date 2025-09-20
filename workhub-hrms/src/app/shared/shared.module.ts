import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';

// Components
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { DepartmentSelectorComponent } from './components/department-selector/department-selector.component';
import { RoleDemoComponent } from './components/role-demo/role-demo.component';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { NotificationToastContainerComponent } from './components/notification-toast-container/notification-toast-container.component';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';
import { TenantAwareDirective } from './directives/tenant-aware.directive';
import { HasPermissionDirective } from './directives/has-permission.directive';

// Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';

const components = [
  PageHeaderComponent,
  LoadingSpinnerComponent,
  ConfirmDialogComponent,
  UnauthorizedComponent,
  DepartmentSelectorComponent,
  RoleDemoComponent,
  NotificationCenterComponent,
  NotificationToastComponent,
  NotificationToastContainerComponent
];

const directives = [
  HasRoleDirective,
  TenantAwareDirective,
  HasPermissionDirective
];

const pipes = [
  DateFormatPipe
];

@NgModule({
  declarations: [
    ...components,
    ...directives,
    ...pipes
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ...components,
    ...directives,
    ...pipes
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
