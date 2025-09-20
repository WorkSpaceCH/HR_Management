import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-hr-analytics-widget',
  templateUrl: './hr-analytics-widget.component.html',
  styleUrls: ['./hr-analytics-widget.component.scss']
})
export class HrAnalyticsWidgetComponent {
  @Input() set data(value: any) {
    if (value) {
      this._data = value;
      this.processData();
    }
  }
  
  get data(): any {
    return this._data;
  }
  
  private _data: any;
  
  // Charts data
  employeeDistribution: any[] = [];
  departmentMetricsColumns: string[] = ['department', 'headcount', 'openPositions', 'turnoverRate'];
  departmentMetricsDataSource = new MatTableDataSource<any>([]);
  recruitmentMetricsColumns: string[] = ['position', 'applicants', 'interviewed', 'hired', 'conversionRate'];
  recruitmentMetricsDataSource = new MatTableDataSource<any>([]);
  
  // Chart options
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#6b48ff', '#12939A']
  };
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Department';
  yAxisLabel = 'Employees';
  
  /**
   * Process the input data for charts and tables
   */
  private processData(): void {
    if (this.data) {
      // Process employee distribution data for pie chart
      this.employeeDistribution = this.data.departmentBreakdown.map((item: any) => {
        return {
          name: item.department,
          value: item.count
        };
      });
      
      // Process department metrics for table
      this.departmentMetricsDataSource.data = this.data.departmentMetrics || [];
      
      // Process recruitment metrics and add calculated fields
      if (this.data.recruitmentMetrics) {
        const processedData = this.data.recruitmentMetrics.map((item: any) => {
          return {
            ...item,
            conversionRate: ((item.hired / item.applicants) * 100).toFixed(1) + '%'
          };
        });
        this.recruitmentMetricsDataSource.data = processedData;
      }
    }
  }
  
  /**
   * Format date for display
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
  
  /**
   * Format a number as percentage
   */
  formatPercent(value: number): string {
    return value.toFixed(1) + '%';
  }
}
