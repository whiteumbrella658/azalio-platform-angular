import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(private http: ApiService) { }

  getSchedules(searchText = '', filterData, dateUrl, onlyPublished): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.get.schedules + dateUrl;
      if (searchText) {
        url += '&search=' + searchText;
      }
      if (onlyPublished) {
        url += '&published_only=' + onlyPublished;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      }
      else if (filterData?.team_id) {
        url += '&team_id=' + filterData.team_id;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  addSchedule(data, region_id) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.addSchedule + '?region_id=' + region_id;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  addLeave(data, region_id) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.addLeave + '?region_id=' + region_id;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  publishSchedule(storeId, isSendNotification) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.publishSchedule + '?store_id=' + storeId + '&is_send_notification=' + isSendNotification;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  deleteSchedule(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.deleteSchedule;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateSchedule(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.updateSchedule;
      // if (data.parentId) {// skip this id while checking overlap
      //   url += '?skipScheduleId=' + data.parentId;
      // }
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  splitSchedule(data, region_id) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.splitSchedule + '?region_id=' + region_id;
      // if (skipOverlapId) { // skip this id while checking overlap
      //   url += '&skipScheduleId=' + skipOverlapId;
      // }
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getLeaves(dateUrl, regionId, resourceId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.get.leaves + dateUrl
        + '&region_id=' + regionId
        + '&resource_id=' + resourceId;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getLeaveTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.get.leaveTypes;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateLeave(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.updateLeave;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  deleteLeave(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.deleteLeave;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }


  getOpenSwapHistory(regionId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.get.openSwapHistory + '?region_id=' + regionId;
      this.http.get(url).subscribe((res: any) => {
          resolve(res)
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getLeaveRequests(regionId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.get.leaveRequests + '?region_id=' + regionId;
      this.http.get(url).subscribe((res: any) => {
          resolve(res)
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  respondToOpen(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.respondToOpen;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  respondToSwap(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.respondToSwap;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  respondToLeaveRequest(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.acceptLeave
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  copySchedules(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.schedule.post.copySchedules
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

}
