import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  isPanelOpen = false;
  isLoading = true;
  activeTab: 'all' | 'unread' | 'read' = 'all';
  filteredNotifications: Notification[] = [];
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    public notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to all notifications
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        this.filterNotifications();
        this.isLoading = false;
      })
    );
    
    // Subscribe to unread count
    this.subscriptions.push(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
    
    // Subscribe to new notifications to show toast
    this.subscriptions.push(
      this.notificationService.newNotification$.subscribe(notification => {
        // Only show toast if the notification is relevant to the current user
        if (this.isNotificationRelevantToUser(notification)) {
          this.showToast(notification);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }
  
  closePanel(): void {
    this.isPanelOpen = false;
  }
  
  setActiveTab(tab: 'all' | 'unread' | 'read'): void {
    this.activeTab = tab;
    this.filterNotifications();
  }
  
  filterNotifications(): void {
    switch (this.activeTab) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.isRead);
        break;
      case 'read':
        this.filteredNotifications = this.notifications.filter(n => n.isRead);
        break;
      case 'all':
      default:
        this.filteredNotifications = [...this.notifications];
        break;
    }
    
    // Further filter by relevance to current user
    this.filteredNotifications = this.filteredNotifications.filter(
      notification => this.isNotificationRelevantToUser(notification)
    );
  }
  
  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation(); // Prevent clicking action from navigating
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }
  
  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation(); // Prevent clicking action from navigating
    this.notificationService.deleteNotification(notification.id);
  }
  
  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
  }
  
  handleNotificationClick(notification: Notification): void {
    // Mark as read when clicked
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }
    
    // Handle action if specified
    if (notification.action?.route) {
      this.router.navigateByUrl(notification.action.route);
      this.closePanel();
    } else if (notification.action?.callback) {
      notification.action.callback();
      this.closePanel();
    }
  }
  
  // Check if a notification is relevant to the current user
  private isNotificationRelevantToUser(notification: Notification): boolean {
    // If no target user or roles, show to everyone
    if (!notification.targetUserId && (!notification.targetRoles || notification.targetRoles.length === 0)) {
      return true;
    }
    
    // Use currentUserValue property from AuthService instead of getCurrentUser()
    const currentUser = this.authService.currentUserValue;
    
    // If no user is logged in, don't show targeted notifications
    if (!currentUser) {
      return false;
    }
    
    // Check if notification is targeted for this specific user
    if (notification.targetUserId && notification.targetUserId === currentUser.id) {
      return true;
    }
    
    // Check if notification is for one of user's roles
    if (notification.targetRoles && notification.targetRoles.includes(currentUser.role.toLowerCase())) {
      return true;
    }
    
    return false;
  }
  
  // Show a toast notification - this could use a proper Toast service
  private showToast(notification: Notification): void {
    // For simplicity, we're just logging to console
    // A real implementation would use a Toast UI component
    console.log('Toast Notification:', notification.title, notification.message);
    
    // Mock toast functionality with browser notification if supported
    if (Notification && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/images/notification-icon.png'
      });
    }
  }
  
  // Get CSS class for notification type
  getNotificationTypeClass(type: string): string {
    switch (type) {
      case 'success': return 'notification-success';
      case 'warning': return 'notification-warning';
      case 'error': return 'notification-error';
      case 'info':
      default:
        return 'notification-info';
    }
  }
  
  // Format notification time as relative (e.g., "2h ago")
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Get notification icon based on category
  getNotificationIcon(category: string): string {
    switch (category) {
      case 'leave': return 'calendar';
      case 'performance': return 'chart-line';
      case 'task': return 'tasks';
      case 'payroll': return 'money-bill';
      case 'system': return 'cog';
      case 'other':
      default:
        return 'bell';
    }
  }
}
