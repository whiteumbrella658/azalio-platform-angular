import { EventEmitter, Inject, Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from '../http/api.service';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

let configurations;
let regionConfig;
let roles;
let notifications;
let rewardsNotifications;
let userName, userColor;
let companyName;
let stores;
let showIntroModal = false;
let showHighlightsModal=false;
let filterData = null;
let jobId, roleId, userId, email, role = null;
let taskTags, userTags, groups;

@Injectable({
  providedIn: 'root'
})

export class DataSharedService {
    cache: any;
    rolesCache: any;
    notiCache: any;
    rewardsNotiCache: any;
    SharingRegionData = new BehaviorSubject<number>(null);
    SharingRegionName=new BehaviorSubject<string>(null);
    SingleRegionId = new BehaviorSubject<number>(null);
    SingleRegionName=new BehaviorSubject<string>(null);

    isRegionUpdated=new BehaviorSubject<boolean>(false);
    allRegions = new BehaviorSubject<any>(null);
    tagsCache: any;
    userTagsCache: any;
    recallNotifications = new BehaviorSubject<boolean>(false);
    recallRewardsNotifications = new BehaviorSubject<boolean>(false);
    regionCache: any;
    themeObj: any;
    groupsCache: any;
  constructor(private http: ApiService, @Inject(DOCUMENT) private document: Document) { 
    // const userAgent = window.navigator.userAgent;
    // console.log(userAgent);
    // console.log(window.navigator.platform);
  }

    setTheme(themeObj) {
        this.themeObj = themeObj ? themeObj : null;
        if (!this.themeObj) {
            this.clearTheme();
            return;
        }
        Object.keys(this.themeObj).forEach((key) => {
            this.document.documentElement.style.setProperty(`--${key}`, this.themeObj[key]);
        });
  }

    clearTheme() {
        if (this.themeObj) {
            Object.keys(this.themeObj).forEach((key) => {
                this.document.documentElement.style.removeProperty(`--${key}`);
            });
        }
    }


  getConfigurations(hardReload: boolean = false, type = null): Promise<any> {
    if (!this.cache || hardReload) {
        this.cache = new Promise((resolve, reject) => {
            const url = apiUrl.general.get.configurations;
            this.http.get(url).subscribe((res: any) => {
                configurations = res;
                this.setTheme(configurations.company.theme);
                if (!type) {
                    resolve(configurations);
                } else {
                    resolve(configurations[type]);
                }
            }, error => {
                console.log(error);
                reject(error);
            });
    });
    }
    return this.cache
}

getRegionConfig(hardReload: boolean = false, id = null): Promise<any> {
    if (!this.regionCache || hardReload) {
        this.regionCache = new Promise((resolve, reject) => {
            const url = apiUrl.general.get.storeConfig+ '?region_id=' + id;
            this.http.get(url).subscribe((res: any) => {
                regionConfig = res;
                resolve(regionConfig);
            }, error => {
                reject(error);
            });
    });
    }
    return this.regionCache
}

getSchedulerNotification(hardReload: boolean = false) {
    if (!this.notiCache || hardReload) {
        this.notiCache = new Promise((resolve, reject) => {
            const url = apiUrl.schedule.get.notification;
            this.http.get(url).subscribe((res: any) => {
                notifications = res;
                resolve(notifications);
            }, error => {
                console.log(error);
                reject(error);
            });
    });
    }
    return this.notiCache;
}

getRewardsNotification(hardReload: boolean = false) {
    if (!this.rewardsNotiCache || hardReload) {
        this.rewardsNotiCache = new Promise((resolve, reject) => {
            const url = apiUrl.recognition.get.notification;
            this.http.get(url).subscribe((res: any) => {
                rewardsNotifications = res;
                resolve(rewardsNotifications);
            }, error => {
                reject(error);
            });
    });
    }
    return this.rewardsNotiCache;
}

getRoles(hardReload: boolean = false): Promise<any> {
    if (!this.rolesCache || hardReload) {
        this.rolesCache = new Promise((resolve, reject) => {
            const url = apiUrl.user.get.getAllRoles;
            this.http.get(url).subscribe((res: any) => {
                roles = res.roles;
                resolve(roles);
            }, error => {
                console.log(error);
                reject(error);
            });
    });
    }
    return this.rolesCache;
}

getTaskTags(hardReload: boolean = false): Promise<any> {
    if (!this.tagsCache || hardReload) {
        this.tagsCache = new Promise((resolve, reject) => {
            const url = apiUrl.tasks.get.taskTags;
            this.http.get(url).subscribe((res: any) => {
                taskTags = res.tags;
                resolve(taskTags);
            }, error => {
                reject(error);
            });
    });
    }
    return this.tagsCache;
}

getCompanyUserTags(hardReload: boolean = false): Promise<any> {
    if (!this.userTagsCache || hardReload) {
        this.userTagsCache = new Promise((resolve, reject) => {
            const url = apiUrl.user.get.getCompanyUserTags;
            this.http.get(url).subscribe((res: any) => {
                userTags = res.data
                resolve(userTags);
            }, error => {
                reject(error);
            });
        });
    }
    return this.userTagsCache;
}

getStoreGroups(hardReload: boolean = false): Promise<any> {
    if (!this.groupsCache || hardReload) {
        this.groupsCache = new Promise((resolve, reject) => {
            const url = apiUrl.timesheet.get.timesheetGroups;
            this.http.get(url).subscribe((res: any) => {
                groups = res.timesheet_groups;
                resolve(groups);
            }, error => {
                reject(error);
            });
        });
    }
    return this.groupsCache;
}




// savePreferences(data) {
//     return new Promise((resolve, reject) => {
//         const url = apiUrl.user.post.updatePreference;
//         this.http.post(url, data).subscribe((res: any) => {
//             configurations.user_preferences.show_region_filter = data.show_region_filter;
//             resolve('success');                
//         }, error => {
//             reject(error);
//         });
//     });
// }

setConfigurations(config, theme = true) {
    this.cache = null;
    this.rolesCache = null;
    this.tagsCache = null;
    this.userTagsCache = null;
    this.notiCache = null;
    this.rewardsNotiCache = null;
    notifications = userTags = taskTags = roles = configurations = config;
    if (theme) {
        this.clearTheme();
    }
}


setTagsCache(val) {
    this.rolesCache = this.tagsCache = this.userTagsCache = this.groupsCache = val;
}
setNotiCache(val) {
    this.notiCache = val;
}

setRewardsNotiCache(val) {
    this.rewardsNotiCache = val;
}

setShowIntroBool(value: boolean) {
    showIntroModal = value;
}

getShowIntroBool() {
    return showIntroModal;
}

setShowHighlights(value: boolean) {
    showHighlightsModal = value;
}

getShowHighlights() {
    return showHighlightsModal;
}

setUserName(value) {
    userName = value;
}

getUserName() {
    return userName;
}

setLoggedInUserStores(value) {
    stores = value;
}

getLoggedInUserStores() {
    return stores;
}

setLoggedInUserId(value) {
    userId = value;
}

getLoggedInUserId() {
    return userId;
}

setLoggedInUserEmail(value) {
    email = value;
}

getLoggedInUserEmail() {
    return email;
}

setLoggedInUserRole(value) {
    role = value;
}

getLoggedInUserRole() {
    return role;
}

setCompanyName(value) {
    companyName = value;
}

getCompanyName() {
    return companyName;
}

setRoleId(value) {
    roleId = value;
}

getRoleId() {
    return roleId;
}

setUserColor(value) {
    userColor = value;
}

getUserColor() {
    return userColor;
}


setSelectedFilter(data) {
  filterData = data;
}

getSelectedFilter() {
    return filterData;
}

setSelectedJobId (id) {
    jobId = id;
}

getSelectedJobId() {
    return jobId;
}

onSelectionCountChange: EventEmitter<any> = new EventEmitter<any>();
onSelectionCountChangeUnassign: EventEmitter<any> = new EventEmitter<any>();
onAssignUserSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

updateSelectionCount(data, isAssignUser) {
    if (isAssignUser) {
        this.onSelectionCountChange.next(data)
    } else {
        this.onSelectionCountChangeUnassign.next(data)
    }
}

onAssignmentSuccess(isSuccess) {
    this.onAssignUserSuccess.next(isSuccess);
}

setSharingRegionData(regionId:number, regionName:string) {
    this.SharingRegionData.next(regionId);   
    this.SharingRegionName.next(regionName);
  }
  updateRegion(isUpdated:boolean){
    this.isRegionUpdated.next(isUpdated);
  }
  
  updateRecallNotifications(isRecall: boolean){
    this.recallNotifications.next(isRecall);
  }
  
  updateRecallRewardsNotifications(isRecall: boolean){
    this.recallRewardsNotifications.next(isRecall);
  }

  setAllRegions(data) {
    this.allRegions?.next(data);
  }

  setSingleRegionData(regionId:number, regionName:string) {
    this.SingleRegionId.next(regionId);   
    this.SingleRegionName.next(regionName);
  }
  getHighlights(){
    return new Promise((resolve, reject) => {
        let url =apiUrl.general.get.getHighlights
        this.http.get(url).subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });
  }
}
