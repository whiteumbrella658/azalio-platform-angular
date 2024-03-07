import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numFormatter'
})
export class NumFormatterPipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    try {
      if (value > 999 && value < 1000000) {
        return '+' + (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      } else if (value > 1000000) {
        return '+' + (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      } else if (value < 900) {
        return '+' + value;
      }
    } catch (err) {
    }
  }
}