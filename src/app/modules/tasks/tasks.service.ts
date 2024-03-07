import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: ApiService) { }

  getPdf(url: any) {
    return this.http.getPdfFile(url);
  }



  getShiftNames(shifts) {
    return shifts.map((shift)=> {
      return shift.name + (shift.task_repetition && shift.task_repetition > 1 ? '(' + shift.task_repetition + ')' : '')
    }).join(', ');
  }

  isMultiTask(shifts) {
    let flag = false;
    shifts.some(sh => {
      if (sh.task_repetition > 1) {
        flag = true;
        return;
      }
    });
    return flag;
  }

  addTaskComment = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.post.addTaskComment;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };


  addNewTask = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.post.addTask;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  
  editTask = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.patch.editTask;
      this.http.patch(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  addUpdateTaskTags = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.post.addUpdateTags;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  updateTaskPriority = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.patch.updateTaskPriority;
      this.http.patch(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  getFilters = async () => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.get.filters;
      this.http.get(url).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  assignTaskToUser = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.post.assignTaskToUser;
      this.http.patch(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  revokePoints = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.patch.revokePoints + 
      '?points_id=' + data.points_id + '&is_revoked=' + data.is_revoked + '&is_undone=' + data.is_undone;
      const reasonData = data.reason ? {reason: data.reason} : {};
      this.http.patch(url, reasonData).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  deleteTask = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.tasks.delete.deleteTask + '?task_id='+data.task_id;
      this.http.delete(url).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  getTaskHistory(taskId, paginationData = {pageIndex: 0, pageSize: 10}) {
    return new Promise((resolve, reject) => {
      // &region_id='+regionId;
      const url = apiUrl.tasks.get.taskHistory + '?task_id=' + taskId +
      '&page_no=' + (paginationData.pageIndex + 1) + '&page_size=' + paginationData.pageSize;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getReportsTableData(searchText, paginationData = { pageIndex: 0, pageSize: 25 }, filterData) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.tasks.get.logs + '?page_no=' +
        (paginationData.pageIndex + 1) + '&page_size=' + paginationData.pageSize;
      if (searchText) {
        url += '&search=' + searchText;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }


  getDailyReportsTableData(searchText, date, filterData) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.tasks.get.dailyReport + '?date=' + date;
      if (searchText) {
        url += '&search=' + searchText;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      }
      if (filterData?.shift_id) {
        url += '&shift_id=' + filterData.shift_id;
      }
      if (filterData?.all_shifts) {
        url += '&all_shifts=' + filterData?.all_shifts;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }


  getTasksTableData(searchText, paginationData = {pageIndex: 0, pageSize: 25}, filterData, filters = null): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.tasks.get.tasks + '?page_no=' +
      (paginationData.pageIndex + 1) + '&page_size=' + paginationData.pageSize;
      if (searchText) {
        url += '&search=' + searchText;
      }
      if (filterData?.filter_id) {
        url += '&filter_id=' + filterData.filter_id;
      }
      if (filterData?.shift_id) {
        url += '&shift_id=' + filterData.shift_id;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      }
      if (filters) {
        for (const key in filters) {
          if (filters[key]) {
            url+= '&' + key +'=' + filters[key];
          }
        }
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
