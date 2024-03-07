import { Component, OnInit,Input,ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ConfigurationSettingsService } from '../../configuration-settings.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { timezoneMapping } from 'src/constants';
import { minimumFenceRadius, maximumFenceRadius } from 'src/constants';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss']
})
export class AddStoreComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  addStoreForm: FormGroup;
  @Input() storeData: any;
  @Input() isAddAnotherStore: boolean;
  @Input() sameTimezone:string;
  @Input() showGeoMap:boolean;
  @Input() geoFenceData:any;
  @Input() isLocationEnabled:boolean;
  loading:boolean;
  addNewStore:boolean;
  editStore:boolean;
  regionId:any;
  buttonLabel: String ;
  reloadRegionData: Boolean = false;
  timezoneMapping: { key: string; value: string }[];
  title:string;
  storeAddress:string;
  lat:any;
  lng:any;
  mapRadius:any;
  
  constructor(private fb: FormBuilder,
     private ref: NbDialogRef<AddStoreComponent>,
      private service: ConfigurationSettingsService,
      private gs: GeneralService,
      private dataService: DataSharedService,) { 
        this.timezoneMapping = timezoneMapping.slice();
      }

  ngOnInit(): void {
    this.regionId=null;
this.onAddStoreForm();
if(this.storeData){
  this.editStore=true;
  this.addNewStore=false;
  this.title="Edit Store";
  this.regionId= this.storeData?.id;
  const result = this.timezoneMapping.filter((x) => x.value === this.storeData.default_timezone);
  let timezone;
  if (result?.length > 0) {
    timezone = result[0].key;
  }
  this.mapRadius=this.storeData?.radius;
  this.lat=this.storeData?.lat;
  this.lng=this.storeData?.lng;
  this.storeAddress=this.storeData?.address;
  this.showGeoMap=(this.storeData?.is_geofencing===1)?true:false;

  this.addStoreForm.get('store_title').setValue(this.storeData?.title);
  this.addStoreForm.get('timezone').setValue(timezone);
  this.addStoreForm.get('is_geofencing').setValue(this.showGeoMap);
  this.addStoreForm.get('address').setValue(this.storeData?.address);
  this.addStoreForm.get('latitude').setValue(this.storeData?.lat);
  this.addStoreForm.get('longitude').setValue(this.storeData?.lng);
  this.addStoreForm.get('radius').setValue(this.mapRadius);
  this.addStoreForm.get('radius_slider').setValue(this.mapRadius);
  this.buttonLabel = "Update";
  if(this.showGeoMap){
    this.updateValidations();
  }
}else{
  this.title="New Store";
  this.addNewStore=true;
  this.editStore=false;
  this.addStoreForm.get('timezone').setValue(this.sameTimezone);
  this.buttonLabel = "Add";
  if(this.showGeoMap){
    this.addStoreForm.get('is_geofencing').setValue(this.showGeoMap);
    this.mapRadius=this.geoFenceData?this.geoFenceData:null;
    this.updateValidations();
  }
}
  }

  onAddStoreForm(){
  this.addStoreForm=this.fb.group({
  store: [''],
  store_title: ['',[Validators.required ,Validators.maxLength(50), Validators.pattern(/^[-.\/#&+,'()\w\s]*$/)]],
  timezone: ['', Validators.required],
  is_geofencing:false,
  address:'',
  latitude:null,
  longitude:null,
  radius: minimumFenceRadius,
  radius_slider: maximumFenceRadius,
  teamsArray: new FormArray([]),
});
this.updateValidations();
}
updateValidations=()=> {
//  console.log(this.addStoreForm.get('is_geofencing').value, "is geo fence", this.showGeoMap)
  if(this.addStoreForm.get('is_geofencing').value){

    this.addStoreForm.controls.address.setValidators([Validators.required]);
    this.addStoreForm.controls.address.updateValueAndValidity();

    this.addStoreForm.controls.radius.setValidators([Validators.min(minimumFenceRadius),Validators.max(maximumFenceRadius)]);
    this.addStoreForm.controls.radius.updateValueAndValidity();
  }else{
    this.addStoreForm.controls.address.setValidators([]);
    this.addStoreForm.controls.address.updateValueAndValidity();

    this.addStoreForm.controls.radius.setValidators([]);
    this.addStoreForm.controls.radius.updateValueAndValidity();
  }
}
  submit(ngForm) {
    if (ngForm.valid) {
      this.loading = true;
      if (this.addNewStore) {
        this.add(ngForm);
      } else {
        this.update(ngForm);
      }
    } else {
      console.log("Invalid Form: ");
    }
  }

  add = async(ngForm) => {
    const zone = this.addStoreForm.get('timezone').value;
  const timezone = this.timezoneMapping.filter((x) => x.key === zone)[0].value;
     let data=this.formData(timezone);
    try {
      const response: any = await this.service.addNewStore(data);
      this.gs.showToastSuccess(response?.message);
      this.reloadRegionData = !this.reloadRegionData;
      if (this.isAddAnotherStore) {
        // this.resetForm();
        this.close({lastStore: null, refresh: false, createAnother: true, timezone:zone, showGeoMap: this.showGeoMap, geoFenceData:this.geoFenceData});
        return;
      }
      this.close({lastStore: response?.last_store, refresh: true, createAnother: false, timezone:'', showGeoMap: this.showGeoMap, geoFenceData:null});
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.dataService.updateRegion(true);
      this.loading = false;
    }
  }

  update = async(ngForm) => {
    const zone = this.addStoreForm.get('timezone').value;
    const timezone = this.timezoneMapping.filter((x) => x.key === zone)[0].value;
    let data=this.formData(timezone);
    try {
      const response: any = await this.service.updateStore(data);
      this.gs.showToastSuccess(response?.message);
      this.close({lastStore: null, refresh: true, createAnother: false, timezone: zone,showGeoMap: this.showGeoMap, geoFenceData:null});
      setTimeout(() => {
        this.reloadRegionData = !this.reloadRegionData;
      }, 1000);

    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.dataService.updateRegion(true);
      this.loading = false;
    }
  }
  formData(timezone:any){
  const is_geofencing=(!this.isLocationEnabled && this.editStore)?this.showGeoMap:this.addStoreForm.get('is_geofencing').value;
    this.geoFenceData= (is_geofencing)?this.addStoreForm.get('radius').value:null;

  let region = {
      region_title: this.addStoreForm.get('store_title').value,
      default_timezone:timezone,
      is_geofencing:is_geofencing,
      address:is_geofencing?this.addStoreForm.get('address').value:null,
      lat:is_geofencing?this.addStoreForm.get('latitude').value:null,
      lng:is_geofencing?this.addStoreForm.get('longitude').value:null,
      radius:is_geofencing?this.addStoreForm.get('radius').value:null,
      teams: this.teams.controls.map(team => {
        return {
          team_title: team.get('teamName').value
        }
      })
  };
  if(this.editStore){
    region['region_id']=this.regionId;
  }
  return region;
 }
  deleteRegion =  async () => {
    this.loading = true;
    const data = {
      region_id: this.regionId,
    }

    try {
      const response: any = await this.service.deleteStore(data);
      this.gs.showToastSuccess(response?.message);
      this.close({lastStore: null, refresh: true, createAnother: false, timezone:'', showGeoMap:false, geoFenceData:null});
      this.reloadRegionData = !this.reloadRegionData;
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.dataService.updateRegion(true);
      this.loading = false;
    }
  }
close(data:{ lastStore: any, refresh: boolean, createAnother: boolean, timezone: string, showGeoMap: boolean, geoFenceData: any}){
 this.ref.close(data);
}

updateCreateAnother($event){
  this.isAddAnotherStore = $event;
}

onChange(event){
  this.showGeoMap=event
  this.addStoreForm.get('is_geofencing').setValue(this.showGeoMap);
  if(this.addNewStore){
  this.addStoreForm.get('address').setValue(null);
  this.addStoreForm.get('latitude').setValue(null);
  this.addStoreForm.get('longitude').setValue(null);
  }
  this.updateValidations();
}
onLocationValue(event){
    //this.geoFenceData=event;
    this.addStoreForm.get('address').setValue(event?.location);
    this.addStoreForm.get('latitude').setValue(event?.lat);
    this.addStoreForm.get('longitude').setValue(event?.lng);
  

}

get form() { return this.addStoreForm.controls; }
get teams() { return this.form.teamsArray as FormArray; };
}
