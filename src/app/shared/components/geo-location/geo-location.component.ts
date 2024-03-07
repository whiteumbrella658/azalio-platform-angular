import { Component, OnInit,ChangeDetectorRef, NgZone,Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';
import { minimumFenceRadius, maximumFenceRadius } from 'src/constants';

declare var google: any;
@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.scss']
})
export class GeoLocationComponent implements OnInit {
  userAddress: string = ''
  userLatitude: any;
  userLongitude: any;
  autocomplete:any;
  input:any;
  map:any;
  areaCircle: any;
  radius:number;
  marker:any;
  isRadius:boolean;
  @Input() autoInput:string;
  @Input() ngForm;
  @Input() lat:any;
  @Input() lng: any;
  @Input() mapRadius:number;
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
 // @Input() showGeoFence:boolean;
  @Output() locationValue: EventEmitter<any> = new EventEmitter();
 // @Output() radiusValue: EventEmitter<any> = new EventEmitter();
  @Output() geoFencing: EventEmitter<boolean> = new EventEmitter();
  minValue: number;
  maxValue: number;
  value:any;
  selectedAddress: any;
  selectedInputVal: any;
  constructor( private cdRef: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit(): void {
    this.minValue = minimumFenceRadius;
    this.maxValue = maximumFenceRadius;
    this.radius=this.mapRadius?this.mapRadius:this.minValue;
    this.value=(this.radius-this.minValue)/(this.maxValue-this.minValue)*100;
    this.initMap();
  }

  initMap() {
     const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 38.9071923, lng: -77.0368707},
        zoom: 20,
        mapTypeControl: true,
       // mapTypeId: 'satellite'
      }
    );
    this.marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });
    this.input = document.getElementById("pac-input") as HTMLInputElement;
   // if(this.showGeoFence){
    this.form.get('radius').setValue(this.radius);
    this.form.get('radius_slider').setValue(this.radius);
   // this.form.get('is_geofencing').setValue(this.showGeoFence);
   // }
     if(this.autoInput){
      this.input.value=this.autoInput;
      this.selectedAddress = this.input.value;
      map.setCenter({
        lat : this.lat,
        lng : this.lng
      });
      let markAddress = new google.maps.LatLng(this.lat,this.lng);
      this.marker.setPosition(markAddress);
       this.marker.setVisible(true); 
             this.areaCircle = new google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              map,
              center: {lat:this.lat,lng:this.lng},
              radius: this.radius,
            });
            this.isRadius=this.radius>4?true:false;
            this.form.get('radius').enable();
            this.form.get('radius_slider').enable();
        }else{
          let lat= 38.9071923;
          let lng= -77.0368707;
          let markAddress = new google.maps.LatLng(lat,lng);
         this.marker.setPosition(markAddress);
         this.marker.setVisible(true); 
         this.form.get('radius').disable();
         this.form.get('radius_slider').disable();
        }
     
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: [],
    };

    //map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(card);
  
    this.autocomplete = new google.maps.places.Autocomplete(this.input, options);
    this.autocomplete.bindTo("bounds", map);
    

    this.autocomplete.addListener("place_changed", () => {

              this.marker.setVisible(true);
              const place = this.autocomplete.getPlace();
              this.selectedAddress = this.selectedInputVal
              this.form.get('address').setValue(this.selectedInputVal);
              this.cdRef.detectChanges(); 
              this.userLatitude = place.geometry.location.lat()
              this.userLongitude = place.geometry.location.lng()

              if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
              }
              // If the place has a geometry, then present it on a map.
              // if (place.geometry.viewport) {
              //   map.fitBounds(place.geometry.viewport);
              //   map.setZoom(17);
              // } else {
              // map.setCenter(place.geometry.location);
              //   map.setZoom(17);
              // }
              map.setCenter(place.geometry.location);
                map.setZoom(20);
            this.marker.setPosition(place.geometry.location);
            this.marker.setVisible(true);
            if(this.autoInput){
              this.areaCircle.setCenter({lat:this.userLatitude,lng:this.userLongitude})
              this.areaCircle.setRadius(this.radius);
            }else{
             this.areaCircle = new google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              map,
              center: {lat:this.userLatitude,lng:this.userLongitude},
              radius:  Number(this.radius),
            });
         
          }
           this.userAddress=place.geometry.location;
           this.form.get('radius').enable();
           this.form.get('radius_slider').enable();
           this.isRadius=true;
            // let data={location:this.input.value ? this.input.value : place.formatted_address, lat:place.geometry.location.lat(), lng:place.geometry.location.lng()};
            let data={location:this.selectedInputVal, lat:place.geometry.location.lat(), lng:place.geometry.location.lng()};
            this.locationValue.emit(data);
    });

  }
setRadius(){
  let radius =this.form.get('radius').value;
  if(this.input.value){

    this.radius=Number(radius);
    if(this.radius>this.maxValue){
      this.radius=this.maxValue;
    }else if(this.radius < this.minValue){
      this.radius = this.minValue;
    }
    this.form.get('radius').setValue(this.radius);
    this.form.get('radius_slider').setValue(this.radius);
    this.areaCircle.setRadius((this.radius)>(this.minValue-1)?this.radius:this.minValue);
  }
}
onChangeSlider(){
  let inputRange=this.form.get('radius_slider').value;
  if(this.input.value){
    this.radius=Number(inputRange);
     this.value=(this.radius-this.minValue)/(this.maxValue-this.minValue)*100;
    let sliderColor = document.getElementById("input-radius-slider") as HTMLInputElement;
    sliderColor.style.backgroundImage='linear-gradient(to right, #7b68ee 0%, #7b68ee ' + this.value + '%, #fff ' + this.value + '%, white 100%)';
    this.form.get('radius').setValue(this.radius);
    this.areaCircle.setRadius((this.radius)>(this.minValue-1)?this.radius:this.minValue);
   // this.radiusValue.emit(this.radius);
  }
}
setInput(){
  this.selectedInputVal = this.input.value;
 // if( (this.userLatitude|| this.lat || this.showGeoFence) && this.input.value){
    if(this.input.value && this.form.get('radius').enabled){
      // this.form.get('address').setValue(this.selectedAddress)
    this.form.get('radius').enable();
    this.form.get('radius_slider').enable();
    this.isRadius=true;
  }else{
    this.form.get('radius').disable();
    this.form.get('radius_slider').disable();
    this.isRadius=false;
  }
  this.selectedAddress == undefined
  ? this.form.get('address').setValue(null)
  : this.input.value ? this.form.get('address').setValue(this.selectedAddress) : this.form.get('address').setValue(null)
}
onChange(event){
//   if(event){
//   this.form.get('radius').setValue(this.radius);
//   this.form.get('radius_slider').setValue(this.radius);
// //console.log(this.input.value, "Radius Enabled on change", this.form.get('radius').enabled)
//   if(this.input.value && this.form.get('radius').enabled){
//     this.form.get('radius').enable();
//     this.form.get('radius_slider').enable();
//     this.isRadius=true;
//   this.areaCircle?.setRadius((this.radius)>4?this.radius:5);
//   }else{
//     this.form.get('radius').disable();
//     this.form.get('radius_slider').disable();
//     this.isRadius=false;
//   }
//   }else{
//     this.areaCircle?.setRadius(0);
//   }
  this.form.get('radius').setValue(this.radius);
  this.form.get('radius_slider').setValue(this.radius);
 // this.showGeoFence=event;
  this.geoFencing.emit(event);
}

getBackgroundImageURL() {
  this.value=(this.radius-this.minValue)/(this.maxValue-this.minValue)*100;
  if(this.isRadius){
    return 'linear-gradient(to right, #7b68ee 0%, #7b68ee ' + this.value + '%, #fff ' + this.value + '%, white 100%)';
  }else{
    return 'linear-gradient(to right, #b0afb5 0%, #b0afb5 ' + this.value + '%, #fff ' + this.value + '%, white 100%)';
  }
  
 // return `linear-gradient(transparent -30%,#121212, url(${this.response.imageURL})`;
}
}
