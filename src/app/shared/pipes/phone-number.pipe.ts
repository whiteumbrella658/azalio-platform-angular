import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if(value == "" || value == null)
    {
    return "";
    } else if (!value.includes('-')) {
      return value;
    }

    else
    { 
      value = "("+value;
      const phone = value.split('-');
      const countryCodeStr = phone[0];
      const areaCodeStr ='';
      const firstSectionStr = phone[1].slice(0,3);
      const midSectionStr = phone[1].slice(3,6);
      const lastSectionStr = phone[1].slice(6);

      return `${countryCodeStr}) ${areaCodeStr}${firstSectionStr}-${midSectionStr}-${lastSectionStr}`;
   }
 }
}
