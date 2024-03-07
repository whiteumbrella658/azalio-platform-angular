import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class AiSurveyService {

  constructor(private http: ApiService) { }


  getAIGeneratedQuestion = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.aiSurvey.post.getAIGeneratedQuestion;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  getAITranslation = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.aiSurvey.post.getAITranslation;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  cancelScheduledSurvey = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.aiSurvey.post.cancelScheduledSurvey
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  createSurvey = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.aiSurvey.post.createSurvey;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  resendSMS = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.aiSurvey.post.resendSMS;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  getSurveyQuestions(searchText): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.aiSurvey.get.surveyQuestions;
      if (searchText) {
        url += '?search=' + searchText;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getScheduledSurveys(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.aiSurvey.get.scheduledSurveysHistory;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getSurveyResponses(searchText, paginationData = { pageIndex: 0, pageSize: 25 }, filters = null, questionId = null): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.aiSurvey.get.surveyResponses + '?page_no=' +
        (paginationData.pageIndex + 1) + '&page_size=' + paginationData.pageSize;

      if (questionId) {
        url += '&question_id=' + questionId;
      }

      if (searchText) {
        url += '&search=' + searchText;
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
