import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  baseUrl:String;
  selectedMenu: String;
  activatedRoutePath: any;
  responsivenessView: Boolean;
  desktopView: Boolean;
  isAccountOwner: boolean;
  noRegions: boolean;
  showBanner:boolean;
  isSchedulerEnabled: boolean;
  constructor(
    private dataService: DataSharedService,
    private gs: GeneralService,
    private router: Router,
    private route: ActivatedRoute,) { 
      this.noRegions = null;
      route.url.subscribe(() => {
        if(route.snapshot.firstChild === null){
          this.getActivtedRoute();
        }else{
      this.activatedRoutePath = route.snapshot.firstChild.routeConfig?.path;
     // console.log(this.activatedRoutePath,"url path");
        this.getActivtedRoute();
        }
      });
      
      
    }

    
  ngOnInit(): void {
    this.gs.logEvents('required_features_page');
    
    if(this.router.url === ('/settings/stores-details')){
      this.showBanner=false;
    } else{
      this.showBanner=true;
    }
    this.dataService.allRegions.subscribe((res: any) => {
      res !== null ? (Object?.keys(res)?.length == 0 ? this.noRegions = true : this.noRegions = false) : '';
    });
    this.dataService
    .getConfigurations(false)
    .then((config) => {
      this.isAccountOwner = config.role?.role_id === 2 ? true : false;
      this.isSchedulerEnabled = config.company.is_scheduler == 1 ? true : false;
    })
    .finally(() => {
    });
    this.selectedMenu="Required Features"
    this.baseUrl="/settings/"
    this.gs.hideSplashScreen();
    if(document.body.clientWidth < 670){
      this.responsivenessView=true;
      this.desktopView=false;
    }else{
      this.responsivenessView=false;
      this.desktopView=true;
      
    }
    
  }
  getActivtedRoute() {
    switch (this.activatedRoutePath) {
      case 'advanced-settings':
        this.selectedMenu = 'Open Shifts';
        break;
      case 'stores-details':
        this.selectedMenu = 'Stores';
        break;
      case 'roles-permissions':
        this.selectedMenu = 'Roles & Permissions';
        break;
      case 'rules':
        this.selectedMenu = 'Rules';
        break;
      // case 'customize-labels':
      //   this.selectedMenu = 'Customize Labels';
      //   break;
      case 'required-features':
        this.selectedMenu = 'Required Features';
        break;
      default:
        this.selectedMenu = 'Required Features';
    }

  }
  navigateToRoles(path) {
    this.router.navigate([path]);
  }

  navigateToManageStore() {
    this.showBanner=false;
    this.router.navigate(['settings/stores-details']);
  }
  onChangeMenu(showBanner, eventName){
this.showBanner=showBanner;
    this.gs.logEvents(eventName + '_page')
  }
}
