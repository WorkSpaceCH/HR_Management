import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-demo',
  templateUrl: './notification-demo.component.html',
  styleUrls: ['./notification-demo.component.scss']
})
export class NotificationDemoComponent {
  notificationTypes = ['info', 'success', 'warning', 'error'];
  notificationCategories = ['system', 'leave', 'performance', 'task', 'payroll', 'other'];
  selectedType = 'info';
  selectedCategory = 'system';
  notificationTitle = '';
  notificationMessage = '';
  targetRole = '';
  addAction = false;
  actionLabel = 'View Details';
  actionRoute = '/dashboard';
  
  constructor(private notificationService: NotificationService) { }
  
  sendNotification(): void {
    if (!this.notificationTitle || !this.notificationMessage) {
      alert('Please provide both title and message');
      return;
    }
    
    const targetRoles = this.targetRole ? [this.targetRole.toLowerCase()] : [];
    
    let action = undefined;
    if (this.addAction) {
      action = {
        label: this.actionLabel,
        route: this.actionRoute
      };
    }
    
    this.notificationService.sendNotification({
      title: this.notificationTitle,
      message: this.notificationMessage,
      type: this.selectedType as any,
      category: this.selectedCategory as any,
      targetRoles,
      action
    });
    
    // Reset form
    this.notificationTitle = '';
    this.notificationMessage = '';
  }
  
  sendPresetNotification(preset: string): void {
    switch(preset) {
      case 'leave':
        this.notificationService.sendLeaveRequestNotification('John Doe', 'approved');
        break;
      case 'review':
        this.notificationService.sendPerformanceReviewNotification('2025 Q3');
        break;
      case 'task':
        this.notificationService.sendTaskAssignedNotification('Submit monthly report', '2025-09-30');
        break;
      case 'payroll':
        this.notificationService.sendPayrollProcessedNotification('September 2025');
        break;
      default:
        this.notificationService.sendInfoNotification(
          'System Notification',
          'This is a test notification'
        );
    }
  }
}
