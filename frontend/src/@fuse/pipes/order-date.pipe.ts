import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderDate'
})
export class OrderDatePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): unknown {
      const day = value.getDate();
      if (day === 1) {
          return 'st';
      } else if (day === 2) {
          return 'nd';
      } else if (day === 3) {
          return 'rd';
      } else  {
          return 'th';
      }
  }
}
