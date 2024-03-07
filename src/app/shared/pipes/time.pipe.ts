import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if (!value) {
      return '';
    }
    const result = value.split(':');
    // if (result[0] === '00' && result[1] === '00') {
    //   return '';
    // }
    return result[0] + 'h ' + result[1] + 'm';
  }
}
