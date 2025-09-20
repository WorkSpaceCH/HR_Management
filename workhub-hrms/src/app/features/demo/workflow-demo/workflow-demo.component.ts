import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-workflow-demo',
  templateUrl: './workflow-demo.component.html',
  styleUrls: ['./workflow-demo.component.scss']
})
export class WorkflowDemoComponent {
  // Sample data for demonstrating workflow-triggered notifications
  leaveRequests = [
    { id: 1, employee: 'John Doe', startDate: '2025-10-01', endDate: '2025-10-03', reason: 'Vacation', status: 'pending' },
    { id: 2, employee: 'Jane Smith', startDate: '2025-10-05', endDate: '2025-10-07', reason: 'Family emergency', status: 'pending' }
  ];
  
  tasks = [
    { id: 1, title: 'Complete Q3 Report', assignee: 'Current User', dueDate: '2025-09-30', status: 'in_progress' },
    { id: 2, title: 'Prepare Training Materials', assignee: 'Current User', dueDate: '2025-10-15', status: 'not_started' }
  ];
  
  employees = [
    { id: 1, name: 'John Doe', role: 'Developer' },
    { id: 2, name: 'Jane Smith', role: 'Designer' },
    { id: 3, name: 'Robert Johnson', role: 'Product Manager' }
  ];
  
  constructor(private notificationService: NotificationService) { }
  
  // Simulate leave request approval workflow
  approveLeaveRequest(request: any): void {
    request.status = 'approved';
    
    // Send notification
    this.notificationService.sendLeaveRequestNotification(request.employee, 'approved');
    
    // This would trigger an email, update database, etc. in a real app
  }
  
  // Simulate leave request rejection workflow
  rejectLeaveRequest(request: any): void {
    request.status = 'rejected';
    
    // Send notification
    this.notificationService.sendLeaveRequestNotification(request.employee, 'rejected');
    
    // This would trigger an email, update database, etc. in a real app
  }
  
  // Simulate task assignment workflow
  assignTask(task: any, employeeId: number): void {
    const employee = this.employees.find(e => e.id === employeeId);
    if (employee) {
      task.assignee = employee.name;
      
      // Send notification
      this.notificationService.sendTaskAssignedNotification(task.title, task.dueDate);
      
      // This would update database, send emails, etc. in a real app
    }
  }
  
  // Simulate performance review scheduling
  schedulePerformanceReview(employeeId: number): void {
    const employee = this.employees.find(e => e.id === employeeId);
    if (employee) {
      // Send notification
      this.notificationService.sendPerformanceReviewNotification('2025 Q3');
      
      // This would create calendar events, update database, etc. in a real app
    }
  }
  
  // Simulate payroll processing
  processPayroll(): void {
    // Send notification
    this.notificationService.sendPayrollProcessedNotification('September 2025');
    
    // This would trigger payroll system, update database, etc. in a real app
  }
}
