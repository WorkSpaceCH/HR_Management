import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { DemoRoutingModule } from './demo-routing.module';
import { NotificationDemoComponent } from './notification-demo/notification-demo.component';
import { WorkflowDemoComponent } from './workflow-demo/workflow-demo.component';

@NgModule({
  declarations: [
    NotificationDemoComponent,
    WorkflowDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DemoRoutingModule
  ]
})
export class DemoModule { }
