import { Pipe, PipeTransform } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';

@Pipe({
  name: 'days'
})
export class DaysPipe implements PipeTransform {

  constructor(private gs: GeneralService) {

  }

  transform(value: string, startDate: string, endDate: string): unknown {
    if (value) {
      if (startDate && endDate) {
        const days = this.gs.daysBetweenInclusive(new Date(startDate), new Date(endDate));
        return days > 1 ? days + ' days' : days + ' day';
      }
    }
    return null;
  }

}
