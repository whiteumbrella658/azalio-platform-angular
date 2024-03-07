import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private http: ApiService) { }

  getTimesheetTableData(searchText, paginationData = {pageIndex: 0, pageSize: 25}, filterData, startDate, endDate = startDate, filters = null): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.timesheet.get.timesheetSummary + '?from_date=' + startDate + '&to_date=' + endDate + '&page_no=' +
      (paginationData.pageIndex + 1) + '&page_size=' + paginationData.pageSize;
      if (searchText) {
        url += '&user_search=' + searchText;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      }
      else if (filterData?.team_id) {
        url += '&team_id=' + filterData.team_id;
      }
      if (filters) {
        for (const key in filters) {
          if (filters[key] && filters[key] !== 0) {
            url+= '&' + key +'=' + filters[key];
          }
        }
      }
      if(startDate && endDate ){
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    }
    });
  }

  DefaultTimezone(userId, regionId){
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.get.DefaultTimezone + '?user_id=' + userId + '&region_id=' + regionId;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getTimesheetDetails (date, userId, regionId) {
    return new Promise((resolve, reject) => {
      const url = apiUrl.timesheet.get.timesheetDetails + '?date=' + date + '&user_id=' + userId+'&region_id='+regionId;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  addTimeSheetEntry = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.timesheet.post.addTimesheetEntry;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateTimeSheetEntry = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.timesheet.post.updateTimesheetEntry;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }


  deleteTimesheetEntry = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.timesheet.post.deleteTimesheetEntry;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  exportSummaryReport = async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.timesheet.get.exportSummaryReport;
      url += `?from_date=${data.startDate}&to_date=${data.endDate}`;
      if (data.store_group_id) {
        url += `&store_group_id=${data.store_group_id}`;
      }
      if (data.role) {
        url += `&role=${data.role}`;
      }
      if(data.regionId) {
        url += `&region_id=${data.regionId}`;
      }

      if(data.teamId) {
        url += `&team_id=${data.teamId}`;
      }

      if(data.search) {
        url += `&search=${data.search}`
      }

      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  exportDetailedReport = async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.timesheet.get.exportDetailedReport;
      url += `?from_date=${data.startDate}&to_date=${data.endDate}`;
      if (data.store_group_id) {
        url += `&store_group_id=${data.store_group_id}`;
      }
      if (data.role) {
        url += `&role=${data.role}`;
      }
      if(data.regionId) {
        url += `&region_id=${data.regionId}`;
      }

      if(data.teamId) {
        url += `&team_id=${data.teamId}`;
      }

      if(data.search) {
        url += `&search=${data.search}`
      }

      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }
}
