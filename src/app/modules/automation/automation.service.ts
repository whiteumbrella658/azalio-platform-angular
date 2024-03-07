import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  constructor(
    private http: ApiService
  ) { }

  getAutomationData(regionId) {
    return new Promise((resolve, reject) => {
      const url = apiUrl.automation.get.automation + '?region_id=' + regionId;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  addAutomation = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.automation.post.addAutomation;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  updateAutomationStatus = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.automation.patch.updateAutomationStatus;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  // deleteAutomation= async (data) => {
  //   return new Promise((resolve, reject) => {
  //     const url = apiUrl.tasks.delete.deleteTask + '?task_id='+data.task_id;
  //     this.http.delete(url).subscribe((res: any) => {
  //         resolve(res);
  //       },(error) => {
  //         console.log(error);
  //         reject(error);
  //       }
  //     );
  //   });
};


