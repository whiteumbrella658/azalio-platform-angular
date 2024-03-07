import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  adminInfo: any;

  constructor(
    private http: ApiService,
    private storageService: LocalStorageService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.getAdminInfo()
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/home']);
    this.storageService.removeToken();
  }

  getAdminInfo() {
    const url = apiUrl.admin.get.info;
    this.http.get(url).subscribe((res: any) => {
      this.adminInfo = res.user_info;
    }, (error) => {
      console.log(error);
    });
  }

}
