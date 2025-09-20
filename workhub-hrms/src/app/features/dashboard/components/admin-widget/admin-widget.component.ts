import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-widget',
  templateUrl: './admin-widget.component.html',
  styleUrls: ['./admin-widget.component.scss']
})
export class AdminWidgetComponent {
  @Input() data: any;
  
  /**
   * Format date for display
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
  
  /**
   * Get severity class for alerts
   */
  getSeverityClass(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  }
  
  /**
   * Get system health status class
   */
  getHealthStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'status-healthy';
      case 'warning':
        return 'status-warning';
      case 'critical':
        return 'status-critical';
      default:
        return '';
    }
  }
  
  /**
   * Get indicator class for resource usage
   */
  getResourceClass(usage: number): string {
    if (usage >= 80) {
      return 'resource-high';
    } else if (usage >= 60) {
      return 'resource-medium';
    } else {
      return 'resource-low';
    }
  }
}
