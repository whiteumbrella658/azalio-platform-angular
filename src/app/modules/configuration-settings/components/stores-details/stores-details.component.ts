import { Component, OnInit,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AddStoreComponent } from '../add-store/add-store.component';
import { NbDialogService, NbMenuService, NbSidebarService } from '@nebular/theme';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfigurationSettingsService } from '../../configuration-settings.service';
import { timezoneMapping } from 'src/constants';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { AddShiftComponent } from '../add-shift/add-shift.component';
import { GeneralService } from 'src/app/core/services/general.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stores-details',
  templateUrl: './stores-details.component.html',
  styleUrls: ['./stores-details.component.scss']
})
export class StoresDetailsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'shifts', 'timezone', 'location','geo_fence', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>([]);
	@ViewChild(MatPaginator) MatPaginator: MatPaginator;
  loading:boolean;
  paginator: any;
  disable:boolean;
  openAddView:boolean;
  storeData:any;
  isAddAnotherStore:boolean;
  emptySearchResults: boolean;
	emptyResults: boolean;
  pageEvent: PageEvent;
  searchText:string;
  searchOn: string;
  timezone:string;
  showGeoMap:boolean=false;
  geoFenceData:any;
  isLocationEnabled:boolean;
  timezoneMapping: { key: string; value: string; name: string; }[];
  isAzalioPlay: boolean;
  constructor(private dialogService: NbDialogService,
    private router: Router,
    private gs: GeneralService,
    private service: ConfigurationSettingsService, private dataService: DataSharedService,) {
      this.timezoneMapping = timezoneMapping.slice();
      this.dataService.getConfigurations(false).then((config) => {
        this.isLocationEnabled =  config.company?.is_location === 1 ? true : false;
        this.isAzalioPlay = config.company?.is_azalio_play === 1 ? true : false;
      }).finally(() => {
        if (this.isAzalioPlay) {
          this.displayedColumns = ['name', 'shifts', 'pin', 'timezone', 'location','geo_fence', 'action']; 
        }
      });
     }

  ngOnInit(): void {
    this.disable = true;
    this.openAddView=true;
    this.getData();
    this.geoFenceData=null;
  }

  changeTimezone(el, time) {
    return this.gs.changeTimezone(new Date(time), el.default_timezone)
  }

  getZone(el) {
    const res = this.timezoneMapping.filter(t=> t.value == el.default_timezone)
    if (res && res[0] ) {
      return res[0].key;
    }
    return '';
  }


  onAddShift(element) {
    this.dialogService
    .open(AddShiftComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { store: element, isEdit: false },
    })
    .onClose.subscribe((isClose) => {
      if (isClose) {
        this.getData();
      } else if (isClose == false) {
        this.onAddShift(element);
        this.getData();
      }
    });
  }

  
  onEditShift(element) {
    this.dialogService
    .open(AddShiftComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { store: element, isEdit: true },
    })
    .onClose.subscribe((isClose) => {
      if (isClose) {
        this.getData();
      }
    });
  }

  onAddStore() {
   // this.openAddView=true;
    this.storeData = null;
    this.dialogService
      .open(AddStoreComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        context: {storeData: this.storeData, isAddAnotherStore: this.isAddAnotherStore, sameTimezone: this.timezone, showGeoMap: this.showGeoMap, geoFenceData:this.geoFenceData, isLocationEnabled:this.isLocationEnabled },
      })
      .onClose.subscribe((data) => {
        if (data.refresh) {
          this.getData(data.lastStore);
          this.storeData = null;
          this.openAddView = false;
          this.isAddAnotherStore=false;
          this.timezone=null;
          this.showGeoMap=false;
          this.geoFenceData=null;
        } else if (!data.refresh && data.createAnother) {
          //re-open the modal and only update hierarchy data
          this.storeData = null;
          this.openAddView = true;
          this.isAddAnotherStore=data.createAnother;
          this.timezone=data.timezone;
          this.showGeoMap=data.showGeoMap;
          this.geoFenceData=data.geoFenceData;
          this.getData();
          this.onAddStore(); //re-open
        } else {
          this.storeData = null;
          this.openAddView = false;
          this.isAddAnotherStore=false;
          this.timezone=null;
          this.showGeoMap=false;
          this.geoFenceData=null;
        }
      });
  }

editStore(element){
      this.gs.logEvents('edit_store')
      this.storeData = element;
      this.dialogService
      .open(AddStoreComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        context: { storeData: this.storeData, isAddAnotherStore: this.isAddAnotherStore,isLocationEnabled:this.isLocationEnabled },
      })
      .onClose.subscribe((data) => {
        if (data.refresh) {
          this.getData();
          this.storeData = null;
          this.openAddView = false;
          this.isAddAnotherStore=false;
        } 
      else {
          this.openAddView = false;
          this.isAddAnotherStore=false;
        }
      });
  }
  getData(lastStore = null) {
		this.dataSource=null;
		this.loading = true;
	this.service
			.getAllStores(this.searchText, this.pageEvent,)
			.then((response) => {
				//this.dataSource = response?.stores;
        if (lastStore && response.stores?.length > 1) {
          response.stores = response.stores.filter(x=> x.id !== lastStore.id)
          response.stores.unshift(lastStore);
        }
        this.dataSource = response?.stores.map(obj =>{
          const result = this.timezoneMapping.filter((x) => x.value === obj.default_timezone);
          return  { ...obj, timezone: result[0]?.name }
        }   
      );
				this.paginator = response?.pagination;
				//this.numberOfUsers(response.total);
				this.emptySearchResults = response?.stores?.length === 0 && this.searchText ? true : false;
				this.emptyResults = response?.stores?.length === 0 && !this.searchText ? true : false;

			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				this.loading = false;
			});
	
	}
  goToSettings() {
		this.router.navigate(['settings/advanced-settings'])
	}
  onSearch(searchText) {
    this.gs.logEvents('search_store')
    this.searchText = searchText.trim();
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

  onSearchAll(searchText) {
    this.gs.logEvents('search_store')
    this.searchText = searchText.trim();
    this.getData();
  }
  canDeactivate(): Observable<boolean> | boolean {
    return this.disable?false:true;
    }

    togglePin($event, element) {
      $event.stopPropagation(); 
      if (element.showPin == null) {
        element.showPin = true;
        return;
      }
      element.showPin = !element.showPin;
    }

}

export interface PeriodicElement {
	name: string;
  pin: any;
	timezone: string;
	location: string;
  geo_fence:string;
}
