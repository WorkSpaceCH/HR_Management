import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationDemoComponent } from './notification-demo/notification-demo.component';
import { WorkflowDemoComponent } from './workflow-demo/workflow-demo.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Role } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notifications',
    pathMatch: 'full'
  },
  {
    path: 'notifications',
    component: NotificationDemoComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  },
  {
    path: 'workflow',
    component: WorkflowDemoComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
