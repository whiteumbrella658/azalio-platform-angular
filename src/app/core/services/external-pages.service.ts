import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalPagesService {

  constructor(private http: ApiService, private authService: AuthService) { }

  tokenaccess=(temptoken, isStoreApp)=>{
    return new Promise((resolve, reject) => {
        let url;
        isStoreApp ? url = apiUrl.external.put.sharedscheduler : url = apiUrl.external.put.mobileScheduler;
        this.http.getSharedToken(url, temptoken).subscribe(
          async (res: any) => {
            resolve(res);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });
  }

  getSchedules(searchText = '', dateUrl, isStoreApp): Promise<any> {
    return new Promise((resolve, reject) => {
      let url;
      isStoreApp ? url = apiUrl.external.get.schedules+ dateUrl : url = apiUrl.external.get.mobileSchedules + dateUrl;
      if (searchText) {
        url += '&search=' + searchText;
      }
      this.http.getSharedScheduler(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

}