import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: ApiService) {}

  addNewRegion = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.post.Region;
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

  resendInvite = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.resendInvite;
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

  getRegions = async (searchText = '') => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.get.Regions + '?is_generic_key=1&search=' + searchText;
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.regions);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  updateRegions = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.post.updateRegion;
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

  deleteRegion = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.post.deleteRegion;
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

  addUsers = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.addUsers;
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

  editUser = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.editUser;
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

  editAccountOwner = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.editAccountOwner;
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

  postGetUsers(regionIds: number[], jobIds: number[], teamIds: number[]): Promise<any> {
    const postBody = {
      pageIndex: 0,
      pageSize: 500,
      region_ids: regionIds,
      job_ids: jobIds,
      team_ids: teamIds,
    };
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl.organisation.get.Users, postBody).subscribe(
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

  getUsersTableData(
    isActive,
    searchText,
    paginationData = { pageIndex: 0, pageSize: 25 },
    filterData,
    filters = null,
    jobId?: any,
    notAssignedjobId?: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =
        apiUrl.organisation.get.Users +
        '?page_size=' +
        paginationData.pageSize +
        '&page_no=' +
        (paginationData.pageIndex + 1) +
        '&is_active=' +
        isActive;
      if (searchText) {
        url += '&search=' + searchText;
      }
      if (jobId || filterData?.job_id) {
        url += '&job_id=' + (jobId || filterData?.job_id);
      }
      if (notAssignedjobId) {
        url += '&not_assigned_job_id=' + notAssignedjobId;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      } else if (filterData?.team_id) {
        url += '&team_id=' + filterData.team_id;
      }
      if (filterData?.communication_hierarchy) {
        url += `&communication_hierarchy=${filterData?.communication_hierarchy}`;
      }
      if (filters) {
        for (const key in filters) {
          if (filters[key]) {
            url+= '&' + key +'=' + filters[key];
          }
        }
      }

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

  getUsersExist = () => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.get.getUsersExist;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  getUserRegions = (userId) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.organisation.get.Regions + '?is_generic_key=1&user_id=' + userId;
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
  };

  deleteUsers = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.deleteUser;
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

  importUsers = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.importUsers;
      this.http.fileUpload(url, data).subscribe(
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

  updateUserTags = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.post.updateUserTags;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };

  getUserTags = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.user.get.getUserTags + '?user_id=' + data.user_id;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, (error) => {
        console.log(error);
        reject(error);
      });
    });
  };
}
