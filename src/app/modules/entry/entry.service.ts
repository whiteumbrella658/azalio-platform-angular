import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/http/api.service';
import { apiUrl } from 'src/api-url';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  constructor(private http: ApiService, private authService: AuthService) {}
  registerCompanyAdmin = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.companyAdminSignUp;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  registerCompanyUser = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.registerCompanyUser;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  validateToken = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.validateToken;
      this.http.post(url, data).subscribe((res: any) => {
          resolve(res);
        },(error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  login = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.login;
      this.http.post(url, data).subscribe(
        async (res: any) => {
          const { access_token, ...user } = res.user;
          if (res.firebase_auth_token !== null) {
           // console.log(user,"user");
            const token = await this.authService.signIn(
              res.firebase_auth_token,
              user
            );
            // console.log('token: ', token);
          }
          resolve(res);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  validateAdmin = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.validateAdmin;
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

  forgotPassword = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.forgotPassword;
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

  updatePassword = (data) => {
    return new Promise((resolve, reject) => {
      const url = apiUrl.home.updatePassword;
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
}
