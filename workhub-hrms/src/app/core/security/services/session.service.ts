import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

/**
 * Session Service
 * 
 * Handles user session management including:
 * - Session timeout tracking
 * - Inactivity detection
 * - Session extension
 * - Session security policies
 */
@Injectable()
export class SessionService {
  // Default timeout in minutes
  private readonly DEFAULT_TIMEOUT = 30;
  // Warning before timeout in minutes
  private readonly WARNING_BEFORE_TIMEOUT = 2;
  
  // Session state
  private sessionTimeoutMinutes = this.DEFAULT_TIMEOUT;
  private lastActivityTime: number = Date.now();
  private sessionTimer: any;
  private warningTimer: any;
  
  // Session state observable
  private sessionStateSubject = new BehaviorSubject<'active' | 'warning' | 'expired'>('active');
  public sessionState$ = this.sessionStateSubject.asObservable();
  
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  /**
   * Initialize the session monitoring
   * Call this after user login
   */
  initSession(timeoutMinutes?: number): void {
    // Clear any existing timers
    this.clearTimers();
    
    // Set the session timeout (use provided or default)
    this.sessionTimeoutMinutes = timeoutMinutes || this.DEFAULT_TIMEOUT;
    
    // Start monitoring activity
    this.startActivityMonitoring();
    
    // Start the session timer
    this.resetSessionTimer();
  }
  
  /**
   * Record user activity to prevent timeout
   */
  recordActivity(): void {
    this.lastActivityTime = Date.now();
    
    // If in warning state, extend session
    if (this.sessionStateSubject.getValue() === 'warning') {
      this.extendSession();
    }
  }
  
  /**
   * Extend the current session
   */
  extendSession(): void {
    this.sessionStateSubject.next('active');
    this.resetSessionTimer();
  }
  
  /**
   * End the current session
   */
  endSession(): void {
    this.clearTimers();
    this.sessionStateSubject.next('expired');
    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
  
  /**
   * Get remaining session time in seconds
   */
  getRemainingSessionTime(): number {
    const elapsedMs = Date.now() - this.lastActivityTime;
    const sessionTimeoutMs = this.sessionTimeoutMinutes * 60 * 1000;
    const remainingMs = Math.max(0, sessionTimeoutMs - elapsedMs);
    return Math.floor(remainingMs / 1000);
  }
  
  /**
   * Reset the session timer
   */
  private resetSessionTimer(): void {
    // Clear existing timers
    this.clearTimers();
    
    // Record the activity time
    this.lastActivityTime = Date.now();
    
    // Calculate timeout and warning times in milliseconds
    const timeoutMs = this.sessionTimeoutMinutes * 60 * 1000;
    const warningMs = (this.sessionTimeoutMinutes - this.WARNING_BEFORE_TIMEOUT) * 60 * 1000;
    
    // Set the warning timer
    this.warningTimer = setTimeout(() => {
      this.sessionStateSubject.next('warning');
      
      // Show warning notification
      this.notificationService.sendNotification({
        title: 'Session Expiring Soon',
        message: `Your session will expire in ${this.WARNING_BEFORE_TIMEOUT} minutes due to inactivity. Click to extend.`,
        type: 'warning',
        category: 'system',
        action: {
          label: 'Extend Session',
          callback: () => this.extendSession()
        }
      });
      
    }, warningMs);
    
    // Set the session timeout timer
    this.sessionTimer = setTimeout(() => {
      this.sessionStateSubject.next('expired');
      
      // Show session expired notification
      this.notificationService.sendNotification({
        title: 'Session Expired',
        message: 'Your session has expired due to inactivity. Please log in again.',
        type: 'error',
        category: 'system'
      });
      
      // End the session
      this.endSession();
      
    }, timeoutMs);
  }
  
  /**
   * Clear all session timers
   */
  private clearTimers(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }
  }
  
  /**
   * Start monitoring user activity
   */
  private startActivityMonitoring(): void {
    // We would normally set up event listeners for user activity
    // like mouse movements, key presses, etc.
    // For this example, we'll just use a simple interval to check
    
    const activityEvents = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners to record activity
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, () => this.recordActivity());
    });
  }
}
