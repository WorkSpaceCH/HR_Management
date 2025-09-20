import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-toast-container',
  templateUrl: './notification-toast-container.component.html',
  styleUrls: ['./notification-toast-container.component.scss']
})
export class NotificationToastContainerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  
  constructor(
    private notificationService: NotificationService,
    private toastService: ToastService
  ) { }
  
  ngOnInit(): void {
    // Subscribe to new notifications
    this.subscription = this.notificationService.newNotification$.subscribe(
      (notification: Notification) => {
        // The ToastService will now handle creating the toast components
        // We don't need to do anything here as the toast service was already
        // updated to create toasts when new notifications come in
      }
    );
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
