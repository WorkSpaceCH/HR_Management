import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Notification } from '../../../core/services/notification.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss'],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      transition('void => visible', animate('300ms ease-out')),
      transition('visible => hidden', animate('300ms ease-in'))
    ])
  ]
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  @Input() notification!: Notification;
  @Input() autoClose = true;
  @Input() duration = 5000; // Default 5 seconds
  @Output() closed = new EventEmitter<void>();
  
  animationState: 'visible' | 'hidden' = 'visible';
  private timeout: any;
  private hovered = false;
  
  ngOnInit(): void {
    if (this.autoClose) {
      this.setTimeout();
    }
  }
  
  ngOnDestroy(): void {
    this.clearTimeout();
  }
  
  onMouseEnter(): void {
    this.hovered = true;
    this.clearTimeout();
  }
  
  onMouseLeave(): void {
    this.hovered = false;
    if (this.autoClose) {
      this.setTimeout();
    }
  }
  
  close(): void {
    this.animationState = 'hidden';
    
    // Wait for animation to finish before emitting close event
    setTimeout(() => {
      this.closed.emit();
    }, 300);
  }
  
  private setTimeout(): void {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      if (!this.hovered) {
        this.close();
      }
    }, this.duration);
  }
  
  private clearTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  
  // Get CSS class for notification type
  getTypeClass(type: string): string {
    switch (type) {
      case 'success': return 'toast-success';
      case 'warning': return 'toast-warning';
      case 'error': return 'toast-error';
      case 'info':
      default:
        return 'toast-info';
    }
  }
  
  // Get icon for notification type
  getTypeIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'exclamation-triangle';
      case 'error': return 'exclamation-circle';
      case 'info':
      default:
        return 'info-circle';
    }
  }
}
