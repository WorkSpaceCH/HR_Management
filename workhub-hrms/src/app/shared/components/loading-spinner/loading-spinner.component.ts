import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 50;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() mode: 'indeterminate' | 'determinate' = 'indeterminate';
  @Input() value: number = 0;
  @Input() overlay: boolean = false;
}
