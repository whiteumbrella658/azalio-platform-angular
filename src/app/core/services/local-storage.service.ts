import { EventEmitter, Injectable } from '@angular/core';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  logout: EventEmitter<null> = new EventEmitter();

  constructor(private dataService: DataSharedService) {}

  get userId(): string {
    try {
      return localStorage.getItem('userId');
    } catch (e) {
      return '';
    }
  }

  set companyId(id) {
    localStorage.setItem('companyId', id);
  }

  get companyId(): string {
    try {
      return localStorage.getItem('companyId');
    } catch (e) {
      return null;
    }
  }

  set userId(id) {
    localStorage.setItem('userId', id);
  }

  setToken(value: any): void {
    localStorage.setItem('azalUser', JSON.stringify(value));
  }

  setRefreshToken(value: any): void {
    localStorage.setItem('azalUserRefresh', JSON.stringify(value));
  }

  getToken(): string {
    const token = JSON.parse(localStorage.getItem('azalUser'));
    return token ? 'Bearer ' + token : null;
  }

  getRefreshToken(): string | null {
    const token = JSON.parse(localStorage.getItem('azalUserRefresh'));
    return token ? 'Bearer ' + token : null;
  }

  removeToken(): void {
    this.logout.emit();
    this.dataService.setSharingRegionData(null,null);
    this.dataService.setSingleRegionData(null, null);
    Object.keys(localStorage).forEach((key: string) => {
        localStorage.removeItem(key);
    });
    
  }

  setSharedRegion(regionId: any, regionName){
    localStorage.setItem('regionId',JSON.stringify(regionId));
    localStorage.setItem('regionName',JSON.stringify(regionName));
  }
  getSharedRegion(): number{
   // alert("local storage");
    let regionId=JSON.parse(localStorage.getItem('regionId'));
    if(!regionId){
      regionId='0';
    }
    return (regionId)?parseInt(regionId):null;
  }

  getSharedRegionName(): string{
     let regionName=localStorage.getItem('regionName');
     if(!regionName){
      regionName=''
     }
     return regionName;
   }

   setSingleRegion(regionId: any, regionName){
    localStorage.setItem('singleRegionId',JSON.stringify(regionId));
    localStorage.setItem('singleRegionName',regionName);
  }

  getSingleRegionId(): number{
    // alert("local storage");
     let regionId=JSON.parse(localStorage.getItem('singleRegionId'));
     if(!regionId){
       regionId='0';
     }
     return (regionId)?parseInt(regionId):null;
   }
 
   getSingleRegionName(): string{
      let regionName=localStorage.getItem('singleRegionName');
      if(!regionName){
       regionName=''
      }
      return regionName;
    }
}
