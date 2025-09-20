import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-widget',
  templateUrl: './employee-widget.component.html',
  styleUrls: ['./employee-widget.component.scss']
})
export class EmployeeWidgetComponent {
  @Input() data: any;
  
  /**
   * Calculate leave usage percentage
   */
  get leaveUsagePercentage(): number {
    if (!this.data?.leaveBalance) return 0;
    const total = this.data.leaveBalance.annual + this.data.leaveBalance.sick;
    const used = this.data.leaveBalance.used;
    return Math.round((used / total) * 100);
  }
  
  /**
   * Format date for display
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
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
   * Check if an announcement is recent (less than 3 days old)
   */
  isRecent(dateStr: string): boolean {
    const announcementDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today.getTime() - announcementDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }
}
