import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-manager-widget',
  templateUrl: './manager-widget.component.html',
  styleUrls: ['./manager-widget.component.scss']
})
export class ManagerWidgetComponent {
  @Input() data: any;
  
  /**
   * Format date for display
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
  
  /**
   * Get days elapsed since a date
   */
  getDaysElapsed(dateStr: string): number {
    const submittedDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today.getTime() - submittedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  /**
   * Get days remaining until a date
   */
  getDaysRemaining(dateStr: string): number {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  /**
   * Check if an approval is urgent (waiting for more than 2 days)
   */
  isUrgent(dateStr: string): boolean {
    return this.getDaysElapsed(dateStr) > 2;
  }
}
