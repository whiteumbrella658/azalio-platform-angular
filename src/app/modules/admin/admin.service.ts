import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: ApiService) { }

  getCustomerTableData(searchText, paginationData = { pageIndex: 0, pageSize: 25 }): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.admin.get.companies + '?page_no=' +
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

  linkCompany(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.integrations.get.linkToken + '?company_id='+data.company_id;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  saveLinkToken(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.integrations.post.saveLinkToken;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  importTasks = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.post.importTasks;
      this.http.fileUpload(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  exportUsers = async (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.get.downloadCompanyUsers + '?company_id=' + data.companyId;
      console.log(url);
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  getUsersTableData = (searchText, paginationData = { pageIndex: 0, pageSize: 25 }): Promise<any> => {
    return new Promise((resolve, reject) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let url = apiUrl.admin.get.companyAllUsers + '?page_size=' + paginationData.pageSize + '&page_no=' + (paginationData.pageIndex + 1);
      if (searchText) {
        url += '&search=' + searchText;
      }
      url += '&company_id=' + urlParams.get('id');;
      this.http.get(url).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }


  updateCustomerSettings = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.updateSetting;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  updateBoring2Fun= async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.updateBoring2Fun;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  updateDashboardFlag = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.updateDashboardFlag;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  updateAskQFlag = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.updateAskQFlag;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  updateSMSFlag = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.updateSMSFlag;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  updateInteractiveCommunicationFlag = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.updateAISurveyFlag;
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  resetPassword = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.admin.patch.resetPassword
      this.http.patch(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

}
