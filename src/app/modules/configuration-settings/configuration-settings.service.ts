import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationSettingsService {

  constructor(private http: ApiService) { }
  getAllStores( searchText, paginationData = { pageIndex: 0, pageSize: 25 }):Promise<any>{
 return new Promise((resolve, reject) => {
      let url =apiUrl.configiration_settings.get.getAllStores +
       '?page_size=' +
        paginationData.pageSize +
        '&page_no=' +
        (paginationData.pageIndex + 1);
        if (searchText) {
          url += '&search=' + searchText;
        }
      this.http.get(url).subscribe(
        (res: any) => {
          //console.log(res)
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
  getRolesPermissionData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =apiUrl.configiration_settings.get.getRolesAndPermissions;
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
  getCustomizedLabels(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =apiUrl.configiration_settings.get.getCustomizedLabels;
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

  getRequiredFeatures(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =apiUrl.configiration_settings.get.getRequiredFeatures;
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
  getRules(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =apiUrl.configiration_settings.get.getRules;
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
  updateRules= async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.configiration_settings.post.updateRules;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateCustomizeLabels= async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.configiration_settings.post.updateCustomizedLabels;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  updateRequiredFeatures= async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.configiration_settings.post.updateRequiredFeatures;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }
  updateRolesAndResponsibilities= async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.configiration_settings.post.updateRolesAndPermissions;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  addNewStore = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.configiration_settings.post.addStore;
      this.http.post(url, data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  addNewShift = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.configiration_settings.post.addShift;
      this.http.post(url, data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };
  updateShifts = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.configiration_settings.post.updateShifts;
      this.http.post(url, data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  updateStore = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.configiration_settings.post.updateStore;
      this.http.post(url, data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  deleteStore = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.configiration_settings.post.deleteStore;
      this.http.post(url, data).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  updateAdvanced = async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.configiration_settings.post.updateAdvancedFeatures;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getAdvanced(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.configiration_settings.get.getAdvancedFeatures;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }
}
