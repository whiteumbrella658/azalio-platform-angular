import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/http/api.service';
import { apiUrl } from 'src/api-url';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-region-dropdown',
  templateUrl: './region-dropdown.component.html',
  styleUrls: ['./region-dropdown.component.scss']
})
export class RegionDropdownComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() reloadData: Boolean;
  @Input() header:boolean;
  // @Input() regionData = null;
  regions: any;
  @Input() placeholder: String;
  @Input() isEditMode:boolean;
  @Input() userId:number;
  @Input() regionId:number;
  @Input() selectedRegionId: Number;
  @Input() selectedRegionTitle: string;
  @Input() singleRegionId: Number;
  @Input() singleRegionName: string;
  @Input() index:number;
  @Input() companyName: string;
  @Input() isRegionsUpdated:boolean;
  @Input() roleId:number;
  @Input() isPartner:number;
  @Output() regionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() oneStoreCompany:EventEmitter<any>=new EventEmitter<any>();
  selectedRegion:any;
  @Input() isNewEntry:boolean;
  @Input() newRegion:boolean;
  showStoreName:boolean;
  storeName:string;
  isNewRegion:boolean=false;
  loading: boolean;

  filteredRegions: any;
  searchText: string;
  searchedOn: boolean = false;

  constructor(private router: Router, private http: ApiService,
    private dataService: DataSharedService,
  ) {
  //  this.placeholder = this.placeholder ? this.placeholder : 'Select Region';
  }

  ngOnInit(): void {
    this.selectedRegion=null;
    this.showStoreName=false;
    setTimeout(() => {
      this.loading = true;
      this.getRegions();
    }, 1);
    
    
  }

  isAzalioPlayReports() {
    if (this.index == 4 && this.router.url.includes('tasks/report')) {//tasks
      return true;
    }
    return false;
  }
  
  isCompanyLevel() {
    if ((this.index > 4 && this.index < 7) || this.index == 9) {
      return true;
    }
    return false;
  }

  isStoreRequired() {
    if (this.isAzalioPlayReports()) {
      return false;
    }
    if (this.index == 4  || this.index == 2 || this.index == 7 || this.index == 8) {
      return true;
    }
    return false;
  }

  getRegions = () => {
    if(this.isEditMode||(this.isNewEntry && this.selectedRegionId)){
      new Promise((resolve, reject) => {
        let url = apiUrl.organisation.get.StoresByUserId + '?user_id=';
        if (this.userId) {
          url += this.userId;
        } 
        this.http.get(url).subscribe((response: {regions: any}) => {
          this.regions = response;
          this.filteredRegions = this.regions;
          if(this.selectedRegionId){this.initRegionPreselection()};
          if (this.regions && this.regions.length > 0) {
            this.selectedRegion=this.regions.filter((region)=>region.store_id==this.regionId);
            this.regionChange.emit(this.selectedRegion[0]);
          } else {
            this.selectedRegion=this.regions.filter((region)=>region.store_id==this.regionId);
            this.regionChange.emit(null);
          }
          setTimeout(() => {
            this.form.controls[this.controlName.toString()].setValue(this.selectedRegion[0]);
          }, 50);
          this.loading = false;
          resolve(response);
        }, error => {
          this.loading = false;
          console.log(error);
          reject(error);
        })
      });
      if(this.regions && this.regionId ){
      this.selectedRegion=this.regions.filter((region)=>region.region_id==this.regionId);
    }

    }else{
    const url = apiUrl.organisation.get.Regions;
    this.http.get(url).subscribe((res: any) => {
      this.regions = res.regions;
      this.filteredRegions = this.regions;
      this.dataService.setAllRegions(this.regions);
      if (this.regions && this.regions.length > 0) {
        if (this.regions.length > 1) {
          //MORE regions than 1: clear single data region.
            // console.log('MORE regions than 1: clear single data region.');
          this.dataService.setSingleRegionData(null, null);
        }
        if (this.header) {
          this.dataService.setLoggedInUserStores(this.regions);
        }
        let index=0;
        if(this.isNewRegion==false){
          if(this.header && this.regions.length==1){
            this.oneStoreCompany.emit({total_stores:this.regions.length, region_id:this.regions[index].region_id, region_title:this.regions[index].region_title});
          }
        if((this.header &&this.regions.length>1)||this.header && (this.roleId ==2|| this.isPartner==1)  ){
          let region={region_id: 0, region_title: this.placeholder, is_region: 1}
          this.regions.unshift(region);
          index=this.regions.findIndex((region)=>region.region_id==this.selectedRegionId);
        }
        this.selectedRegion=this.regions[index];
      setTimeout(() => {
        this.form.controls[this.controlName.toString()].setValue(this.regions[index]);
      }, 20);
          }
          if((this.index ==2 || this.index == 4) && this.selectedRegionId==0){
            this.regionChange.emit(this.regions[0]);
          }else{
            this.regionChange.emit(this.regions[index]);
          }
       
      } else {
        this.regionChange.emit(null);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }
  }
  initRegionPreselection() {
    let region = this.regions?.find((element) => element.store_id === this.selectedRegionId);
    if(!region){
      region={store_id: this.selectedRegionId, store_title: this.selectedRegionTitle, is_region: 1}
      this.regions.push(region);
    }
  }
  change(event) {
    this.selectedRegion=event;
    this.regionChange.emit(event);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.selectedJobId && changes.selectedJobId.currentValue) {
      this.selectedRegionId = changes.selectedRegionId.currentValue;
      if(this.regions.length>1){
      this.selectedRegionTitle = changes.selectedRegionTitle.currentValue;
      }
    }
    if(changes && changes.isRegionsUpdated && changes.isRegionsUpdated.currentValue != changes.isRegionsUpdated.previousValue){
      if(changes.isRegionsUpdated.currentValue===true){
        this.getRegions();
      }
    }
    if (changes && changes.newRegion && changes.newRegion.currentValue) {
      this.isNewRegion = changes.newRegion.currentValue;
    }
    if (changes && changes.companyName?.currentValue) {
      this.companyName = changes.companyName.currentValue;
      if (this.regions && this.regions.length > 0) {
        let result = this.regions.filter(x=> x.region_id === 0);
        if (result && result[0]) {
          result[0].region_title = this.companyName;
        }
      }

    }
  }

  stopDdToClose(event) { // dd was closing on space
    if (event.keyCode === 32 || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.searchText += " ";
    }
  }

  filterRegions() {
    this.searchText?.length > 0 ? this.searchedOn = true : this.searchedOn = false;
    this.filteredRegions = this.regions.filter(option =>      
      option.region_title?.toLowerCase().includes(this.searchText?.toLowerCase())
    );
    this.focusInputField(250);
  }

  focusInputField(timeout) {
    setTimeout(() => {
      const el = document.getElementById('store-search');
      el?.focus();
    }, timeout);
  }

  clearSearch(): void {
    this.focusInputField(5);
    this.searchText = '';
    this.searchedOn = false;
    this.filteredRegions = this.regions
  }
}
