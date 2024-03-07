import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http: ApiService) { }

  addSurvey = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.survey.post.survey;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      }
      );
    });
  };

  getSurveyTableData(searchText, paginationData = { pageIndex: 0, pageSize: 25 }): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.survey.get.surveys + '?page_no=' +
        (paginationData.pageIndex + 1) + '&page_size=' + paginationData.pageSize;
      if (searchText) {
        url += '&search=' + searchText;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  
  exportSurveyReport = async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.survey.get.downloadSurveyReport 
      + '?survey_id=' + data.surveyId + '&timezone=' + Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }
}
