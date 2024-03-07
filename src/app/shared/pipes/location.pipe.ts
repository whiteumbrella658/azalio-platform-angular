import { Pipe, PipeTransform } from '@angular/core';
import { MapsService } from 'src/app/core/services/maps.service';

@Pipe({
  name: 'location'
})


export class LocationPipe implements PipeTransform {
  constructor(private gm: MapsService) {
  
  }

  async transform(value: {lat: any; lng: any}): Promise<string> {
      try {
        if (!value || !value.lat || !value.lng) {
          return null;
        }
        return this.gm.reverseGeocodeLatLng(value).then((address: string) => {
          return address;
        });
      } catch(err){
      }
  }

}
