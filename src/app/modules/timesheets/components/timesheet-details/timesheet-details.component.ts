import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges,OnChanges } from '@angular/core';
import { element } from 'protractor';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, timezoneMapping } from 'src/constants';
import { TimesheetService } from '../../timesheet.service';
import {FirestoreService} from 'src/app/core/services/firestore.service';
import { ApiService } from 'src/app/core/http/api.service';
import { apiUrl } from 'src/api-url';
declare var google: any;
var geocoder = new google.maps.Geocoder();
@Component({
  selector: 'app-timesheet-details',
  templateUrl: './timesheet-details.component.html',
  styleUrls: ['./timesheet-details.component.scss'],
})
export class TimesheetDetailsComponent implements OnInit, OnChanges {
  @Input() selectedData;
  @Output() editClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() addClick: EventEmitter<null> = new EventEmitter<null>();
  @Output() refreshData: EventEmitter<null> = new EventEmitter<null>();

  data: any;
  loading: boolean;
  isLocationEnabled: boolean;
  nameConfig: any;
  timezoneMapping: { key: string; value: string; }[];
  timezone: string;
  errorCount: number;
  timerId: any;
  opacity: number;
  visibleAddButton:boolean;
  regions: any;
  configuration: any;

  constructor(private dataService: DataSharedService, private service: TimesheetService, private gs: GeneralService,private analytics: FirestoreService, private http: ApiService) {
    this.timezoneMapping = timezoneMapping.slice();
   }

  ngOnInit(): void {
    
    this.opacity = avatarOpacity;
    this.errorCount = 0;
    this.timerId = null;
    this.dataService.getConfigurations(false).then((config) => {
      this.configuration = config;
      this.nameConfig = config.company?.custom_names;
      this.isLocationEnabled =  config.company?.is_location === 1 ? true : false;
    }).finally(() => {
    });
  }

  isOwnAddEdit() {
    if (this.selectedData?.user_id === this.dataService.getLoggedInUserId()) {
      if (this.configuration.is_partner || this.configuration.role.role_id === 2 || this.configuration.role.role_title.includes('Account Owner')) {
        return true;
      } else {
        return this.configuration.company?.timesheet.is_edit_own === 1 ? true : false;
      }
    } else {
      return true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectedData.currentValue) {
      this.data = null;
      this.hideShowAddButton();
      this.getData();
    }
  }

  getData() {
    this.timezone = '';
    this.loading = true;
    this.service.getTimesheetDetails(this.selectedData.date, this.selectedData.user_id, this.selectedData.region_id )
      .then((response: any) => {
        this.data = response.timesheetDetail;
        const result = this.timezoneMapping.filter(x=> x.value === this.data.time_zone);
        if (result?.length > 0) {
          this.timezone = result[0].key;
          setTimeout(() => {
            this.loadAddresses();
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async getAddress(element, latlng, key, isRetry = false) {
  
    if (element[key]) {
      return element[key];
    }
    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response && response.results && response.results[0]) {
        // let tooltip='';
        // if(key==='start_location_address' && element.is_outof_radius_start ){
        //   tooltip="Entry outside geo fence. Location: "
        // }else if (key==='end_location_address'&& element.is_outof_radius_end){
        //   tooltip="Entry outside geo fence. Location: ";
        // }
        element[key] = response.results[0].formatted_address;
      }
    } catch (error) {
      this.errorCount++;
      setTimeout(() => {
        this.getAddress(element, latlng, key, true);
      }, this.errorCount * 1100);
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(this.resetErrorCount, 5000);  
    } finally {
    }

  }

  resetErrorCount() {
    this.errorCount = 0;
  }

  edit(entry) {
    this.gs.logEvents('edit_timesheet_entry_popup_opened');
    this.gs.showBackDrop(false);
    this.editClick.emit(entry);
  }

  add() {
    this.gs.showBackDrop(false);
    this.editClick.emit();
  }

  delete(id) {
    this.loading = true;
    this.service.deleteTimesheetEntry({timesheet_id: id})
    .then((response : any) => {
     // this.gs.removeArrayItem(timesheetList, 'timesheet_id', id); // if success
      this.gs.showToastSuccess(response?.message);
      this.getData();
      this.refreshData.emit();
    })
    .catch((error) => {
      this.gs.showToastError(error.message);
      console.log(error);
    })
    .finally(() => {
      this.loading = false;
    });
  }

  loadAddresses() {
    let count = 0;
    let factor = 0;
    if (this.isLocationEnabled) {
      this.data.jobTaskDetails.forEach(job => {
        job.timesheet.forEach(entry => {
          if (count !== 0 && count % 5 === 0 ) {
            factor = factor+1.1;
          }
          if (entry.start_location) {
            setTimeout(() => {
              this.getAddress(entry, entry.start_location,'start_location_address');
            }, factor * 1000);
            count++
          }
          if (entry.end_location) {
            setTimeout(() => {
            this.getAddress(entry, entry.end_location,  'end_location_address');
            }, factor * 1000);
            count++
          }
        });
      });
    }
  }
  hideShowAddButton(){
    new Promise((resolve, reject) => {
      let url = apiUrl.organisation.get.StoresByUserId + '?user_id=';
      if (this.selectedData.user_id) {
        url += this.selectedData.user_id;
      } 
      this.http.get(url).subscribe((response: {regions: any}) => {
        this.regions = response;
        this.visibleAddButton=this.regions.some((region)=>{return region.store_id==this.selectedData.region_id?true:false});
        resolve(response);
      }, error => {
        console.log(error);
        reject(error);
      })
    });
  }
}
