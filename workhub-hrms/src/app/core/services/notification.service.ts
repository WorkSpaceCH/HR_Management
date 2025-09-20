import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { scan, map, delay, filter } from 'rxjs/operators';
import { ToastService } from './toast.service';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  targetUserId?: number; // If notification is for specific user
  targetRoles?: string[]; // If notification is for specific roles
  action?: {
    label: string;
    route?: string;
    callback?: () => void;
  };
  category: 'system' | 'leave' | 'performance' | 'task' | 'payroll' | 'other';
  expiry?: Date; // Optional expiration date
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  // BehaviorSubject maintains the current state of notifications (needed for components that render notifications)
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  
  // Subject for new notifications (for toast/push notifications)
  private newNotificationSubject = new Subject<Notification>();
  
  // Observable that components can subscribe to
  public notifications$ = this.notificationsSubject.asObservable();
  
  // Observable for new notifications only (for toast/alert components)
  public newNotification$ = this.newNotificationSubject.asObservable();
  
  // Observable for unread count
  public unreadCount$ = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.isRead).length)
  );
  
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    // Subscribe to new notifications and add them to the list
    this.subscription = this.newNotification$.pipe(
      // Simulated network delay for async behavior
      delay(500)
    ).subscribe(notification => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([
        notification,
        ...currentNotifications
      ]);
      
      // Show toast for new notification
      this.toastService.showToast(notification);
    });
    
    // Initialize with some example notifications
    this.initializeWithSampleData();
  }

  // Method to send a new notification
  sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateUniqueId(),
      timestamp: new Date(),
      isRead: false
    };
    
    // Emit through the new notification subject
    this.newNotificationSubject.next(newNotification);
  }
  
  // Send a notification after a workflow event
  sendWorkflowNotification(
    category: Notification['category'],
    title: string, 
    message: string,
    type: Notification['type'] = 'info',
    targetRoles?: string[],
    action?: Notification['action']
  ): void {
    this.sendNotification({
      type,
      title,
      message,
      category,
      targetRoles,
      action
    });
  }
  
  // Simulate leave request notification
  notifyLeaveRequest(employeeName: string, leaveId: number): void {
    this.sendWorkflowNotification(
      'leave',
      'Leave Request Pending',
      `${employeeName} has submitted a leave request for approval.`,
      'info',
      ['manager', 'hr'],
      {
        label: 'Review',
        route: `/manager/leaves/${leaveId}`
      }
    );
  }
  
  // Simulate leave approval notification
  notifyLeaveApproval(leaveId: number, approved: boolean, userId: number): void {
    this.sendWorkflowNotification(
      'leave',
      approved ? 'Leave Request Approved' : 'Leave Request Rejected',
      `Your leave request has been ${approved ? 'approved' : 'rejected'}.`,
      approved ? 'success' : 'warning',
      ['employee'],
      {
        label: 'View Details',
        route: `/employee/leave/${leaveId}`
      }
    );
  }
  
  // Simulate task assignment
  notifyTaskAssignment(taskName: string, userId: number): void {
    this.sendWorkflowNotification(
      'task',
      'New Task Assigned',
      `You have been assigned to "${taskName}".`,
      'info',
      ['employee'],
      {
        label: 'View Task',
        route: '/employee/tasks'
      }
    );
  }
  
  // Simulate payroll processing
  notifyPayrollProcessed(period: string): void {
    this.sendWorkflowNotification(
      'payroll',
      'Payroll Processed',
      `Your payslip for ${period} has been processed and is ready for review.`,
      'success',
      ['employee'],
      {
        label: 'View Payslip',
        route: '/employee/payroll'
      }
    );
  }
  
  // Show toast notification using ToastService
  private showToast(notification: Notification): void {
    this.toastService.showToast(notification);
  }
  
  ngOnDestroy(): void {
    // Clean up subscription to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  // Helper methods for demo component
  
  // Send info notification
  sendInfoNotification(title: string, message: string): void {
    this.sendNotification({
      title,
      message,
      type: 'info',
      category: 'system'
    });
  }
  
  // Send leave request notification
  sendLeaveRequestNotification(employeeName: string, status: string): void {
    this.sendNotification({
      title: `Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `${employeeName}'s leave request has been ${status}.`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'warning' : 'info',
      category: 'leave',
      action: {
        label: 'View Details',
        route: '/manager/leaves'
      }
    });
  }
  
  // Send performance review notification
  sendPerformanceReviewNotification(period: string): void {
    this.sendNotification({
      title: 'Performance Review Scheduled',
      message: `Your performance review for ${period} has been scheduled.`,
      type: 'info',
      category: 'performance',
      action: {
        label: 'View Schedule',
        route: '/employee/performance'
      }
    });
  }
  
  // Send task assigned notification
  sendTaskAssignedNotification(taskName: string, dueDate: string): void {
    this.sendNotification({
      title: 'New Task Assigned',
      message: `You have been assigned the task "${taskName}" due on ${dueDate}.`,
      type: 'info',
      category: 'task',
      action: {
        label: 'View Task',
        route: '/employee/tasks'
      }
    });
  }
  
  // Send payroll processed notification
  sendPayrollProcessedNotification(period: string): void {
    this.sendNotification({
      title: 'Payroll Processed',
      message: `Your payslip for ${period} has been processed and is ready for review.`,
      type: 'success',
      category: 'payroll',
      action: {
        label: 'View Payslip',
        route: '/employee/payroll'
      }
    });
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    this.notificationsSubject.next(updatedNotifications);
  }
  
  // Mark all notifications as read
  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => 
      ({ ...notification, isRead: true })
    );
    
    this.notificationsSubject.next(updatedNotifications);
  }
  
  // Delete a notification
  deleteNotification(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    
    this.notificationsSubject.next(updatedNotifications);
  }
  
  // Clear all notifications
  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
  }
  
  // Get notifications for a specific category
  getNotificationsByCategory(category: Notification['category']): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.category === category))
    );
  }
  
  // Utility method to generate a unique ID
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  // Initialize with sample data
  private initializeWithSampleData(): void {
    const sampleNotifications: Notification[] = [
      {
        id: this.generateUniqueId(),
        type: 'info',
        title: 'Welcome to WorkHub HRMS',
        message: 'Welcome to the new HR management system. Explore the features and let us know if you have any questions.',
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        isRead: false,
        category: 'system',
        action: {
          label: 'Explore Dashboard',
          route: '/dashboard'
        }
      },
      {
        id: this.generateUniqueId(),
        type: 'success',
        title: 'Profile Updated',
        message: 'Your employee profile has been successfully updated.',
        timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        isRead: true,
        category: 'other'
      },
      {
        id: this.generateUniqueId(),
        type: 'warning',
        title: 'Leave Balance Low',
        message: 'You have only 2 days of paid leave remaining for this year.',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isRead: false,
        category: 'leave'
      }
    ];
    
    this.notificationsSubject.next(sampleNotifications);
  }
}
