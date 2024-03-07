import { Injectable } from '@angular/core';
// @ts-ignore
import { } from '@types/googlemaps';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  geocoder: any;

  constructor() { 
    this.initGeocoder();
  }

  initGeocoder(): void {
  }
  
  reverseGeocodeLatLng(latlng) {
    this.geocoder = new google.maps.Geocoder();
    // const latlng = {
    //   lat: 40.714224,
    //   lng: -73.961452,
    // };
    return new Promise((resolve, reject) => {
    this.geocoder.geocode({ location: latlng },(
        results: any,
        status: any) => {
        if (status === "OK") {
          if (results && results[0]) {
            return resolve(results[0].formatted_address);
          } else {
            return resolve('Unable to fetch location at this time.');
          }
        } else {
          // console.log("Geocoder failed due to: " + status);
          return resolve('Unable to fetch location at this time.');
        }
      }
    );
    });


  }


}

