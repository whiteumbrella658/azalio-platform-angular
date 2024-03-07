import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

let funFacts;

@Injectable({
  providedIn: 'root'
})
export class AskGptService {
  factsCache: any;

  constructor(private http: ApiService) { }

  getFunFacts(hardReload: boolean = false, isUpdate: boolean = false): Promise<any> {
    if (!this.factsCache || hardReload) {
      this.factsCache = new Promise((resolve, reject) => {
        const url = apiUrl.askQ.get.getFunFacts;
        this.http.get(url).subscribe((res: any) => {
          funFacts = isUpdate ? funFacts.join(res.funfacts) : res.funfacts;
          resolve(funFacts);
        }, error => {
          reject(error);
        });
      });
    }
    return this.factsCache
  }

  getConversations() {
    return new Promise((resolve, reject) => {
      const url = apiUrl.askQ.get.getConversations;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getQuestionHistory(id = null) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.askQ.get.getQuestionHistory;
      if (id) {
        url += '?conversation_id='+id;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getSurveyQuestions(searchText, category): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.askQ.get.getSurveyQuestions;
      if (category) {
        url+= '?category='+ category;
      }
      if (searchText) {
        category ?   url += '&search=' + searchText :   url += '?search=' + searchText;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  askQuestion = async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.askQ.get.askQuestion + '?question=' + data.question;
      if (data.conversation_id) {
        url+='&conversation_id='+data.conversation_id;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  saveGraph = async (data, isSave) => {
    return new Promise((resolve, reject) => {
      const url = isSave ? apiUrl.askQ.post.saveGraph : apiUrl.askQ.post.unsaveGraph;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };


  getHomePageData() {
    return new Promise((resolve, reject) => {
      const url = apiUrl.askQ.get.getHomePageData;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getHomePageGraphs() {
    return new Promise((resolve, reject) => {
      const url = apiUrl.askQ.get.getHomePageGraphs;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getSavedGraphs() {
    return new Promise((resolve, reject) => {
      const url = apiUrl.askQ.get.getSavedGraphs;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getNewFact() {
    if (funFacts.length <= 2) {
      this.getFunFacts(true, true);
    }
    return funFacts.pop().fun_fact;
  }

  updateTrigger = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.askQ.patch.updateTrigger;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };
}
