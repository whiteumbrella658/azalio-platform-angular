import { Injectable } from '@angular/core';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {
  badges = null;
  public maxNumberOfBadges: number = 10;

  constructor(private http: ApiService) { 
    this.setMaxBadgesAllowed();
  }

  setMaxBadgesAllowed() {
    const width =  document.body.clientWidth;
    if (width < 600) {
      this.maxNumberOfBadges = 3;
    } else if (width < 1200) {
      this.maxNumberOfBadges = 6;
    }
  }

  setDefaultBadges(data) {
    this.badges = data;
  }

  getDefaultBadges() {
    return this.badges;
  }

  getGoals(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.recognition.get.goals;
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  // getReward(filterData: any): Promise<any> {
  //   let url = apiUrl.recognition.get.rewardData;
  //   if (filterData?.region_id) {
  //     url += '?region_id=' + filterData.region_id;
  //   } else if (filterData?.team_id) {
  //     url += '?team_id=' + filterData.team_id;
  //   }
  //   return new Promise((resolve, reject) => {
  //     this.http.get(url).subscribe((res: any) => {
  //       resolve(res);
  //     }, error => {
  //       console.log(error);
  //       reject(error);
  //     });
  //   });
  // }


  getUserPointsTableData(
    searchText,
    paginationData = { pageIndex: 0, pageSize: 25 },
    filterData,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =
        apiUrl.recognition.get.userPoints +
        '?page_size=' +
        paginationData.pageSize +
        '&page_no=' +
        (paginationData.pageIndex + 1);
      if (searchText) {
        url += '&search=' + searchText;
      }
      if (filterData?.region_id) {
        url += '&region_id=' + filterData.region_id;
      } 
      // else if (filterData?.team_id) {
      //   url += '&team_id=' + filterData.team_id;
      // }
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
  
  sendAnnouncement = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.recognition.post.addAnnouncement;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  recogniseUser = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.recognition.post.recognize;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  resetPoints = async (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.recognition.post.resetPoints;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  exportPointsReport = async (data) => {
    return new Promise((resolve, reject) => {
      let url = apiUrl.recognition.get.downloadPointsReport
      if (data.region_id) {
        url += '?region_id=' + data.region_id;
      }
      this.http.get(url).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }


  getGiftCardRequests(regionId): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = apiUrl.recognition.get.giftCardRequests + '?region_id=' + regionId;
      this.http.get(url).subscribe((res: any) => {
          resolve(res)
        },(error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  markAsDelivered(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.recognition.post.markAsDelivered;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  respondToGiftRequest(data) {
    return new Promise((resolve, reject) => {
      let url = apiUrl.recognition.post.respondToGiftRequest;
      this.http.post(url, data).subscribe((res: any) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }


  // setReward = async (data) => {
  //   return new Promise((resolve, reject) => {
  //     const url = apiUrl.recognition.post.setReward;
  //     this.http.fileUpload(url, data).subscribe((res: any) => {
  //       resolve(res);
  //     }, error => {
  //       console.log(error);
  //       reject(error);
  //     });
  //   });
  // }
}
