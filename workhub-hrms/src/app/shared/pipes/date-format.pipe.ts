import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | string | number, format: string = 'mediumDate'): string | null {
    if (!value) {
      return '';
    }

    return this.datePipe.transform(value, format);
  }
}
