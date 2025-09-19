import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  route?: string; // Optional route to navigate to on click
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: AppNotification[] = [];
  private notificationsSubject = new Subject<AppNotification[]>();
  private nextId = 1;

  constructor(private snackBar: MatSnackBar) {}

  // Get notifications as an observable
  getNotifications(): Observable<AppNotification[]> {
    return this.notificationsSubject.asObservable();
  }

  // Show a snackbar notification
  showSnackbar(message: string, action: string = 'Close', duration: number = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  // Add a new notification
  addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error', route?: string): void {
    const notification: AppNotification = {
      id: this.nextId++,
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      route
    };

    this.notifications.unshift(notification);
    this.notificationsSubject.next([...this.notifications]);

    // Also show as snackbar if it's an important notification
    if (type === 'error' || type === 'warning') {
      this.showSnackbar(`${title}: ${message}`);
    }
  }

  // Mark a notification as read
  markAsRead(id: number): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].read = true;
      this.notificationsSubject.next([...this.notifications]);
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notificationsSubject.next([...this.notifications]);
  }

  // Clear a notification by id
  clearNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
