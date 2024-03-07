import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { NbMenuService, NbPopoverDirective, NbWindowService } from '@nebular/theme';
import { apiUrl } from 'src/api-url';
import { ApiService } from '../http/api.service';
import { DataSharedService } from '../services/data-shared.service';
import { LocalStorageService } from '../services/local-storage.service';
import { IntroModalComponent } from 'src/app/shared/components/intro-modal/intro-modal.component';
import { WhatNewModalComponent } from 'src/app/shared/components/what-new-modal/what-new-modal.component';
import { NbDialogService } from '@nebular/theme';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import {FirestoreService} from '../services/firestore.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { FormGroup,FormBuilder} from '@angular/forms';
import {UserService} from 'src/app/modules/users/user.service'
import { config } from 'src/environments/configuration';
import LogRocket from 'logrocket';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  @Input() pathChanged;
  tabClass: string;
  index: any;
  profileInfo: any;
  roleConfig: any;
  isTimesheetEnabled: boolean;
  isOrganizationEnabled: boolean;
  isAutomationEnabled: boolean;
  nameConfig: any;
  unreadMessages = 0;
  user$: Observable<any>;
  isRecognitionEnabled: any;
  isCommunicationEnabled: any;
  logoAnalytics: any;
  avatars: HTMLCollectionOf<Element>;
  opacity: number;
  isSettingsEnabled: boolean;
  isAccountOwner: boolean;
  isFirstLogin: any;
  isAccountOwnerFirstLogin: boolean;
  searchOn:string;
  filterOn: any;
  showHelperButton:boolean;
  searchContext: any;
  totalRegion:number;
  selectedRegionId: number;
  selectedRegionName:string;
  singleRegionId: number;
  singleRegionName:string;
  form: FormGroup;
  isSchedulerEnabled: any;
  showStores:boolean;
  roleId:number=0;
  isRegionsUpdated:boolean=false;
  showSideBar: boolean;
  // placeholder:string;
  isPartner:number=0;
  isTaskEnabled: any;
  noRegions: boolean = false;
  userCount:number;
  loading: boolean = false;
  tabOrientation: string;
  isDesktopView: boolean;
  isSchedulerNotification: boolean;
  isTimeOffEnabled: boolean;
  stores: any;
  isOpenSwapNotification: boolean;
  storesOpenSwap: any;
  openSwapEnabled: boolean;
  isRewardsGateway: boolean;
  isRewardsNotification: boolean;
  storesRewardsNoti: any;
  isInteractiveCommunicationEnabled: boolean;
  isAskQ: boolean;
  isAskQEnabled: boolean;

  // storeTitle:string;
  constructor(
    private dataService: DataSharedService,
    private dialogService: NbDialogService,
    private http: ApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private nbMenuService: NbMenuService,
    public storageService: LocalStorageService,
    private analytics: FirestoreService,
    private fb: FormBuilder,
    public gs: GeneralService,
    private service: UserService,
  ) {
    this.dataService
    .getConfigurations(false)
    .then((config) => {
      this.nameConfig = config.company?.custom_names;
      // this.storeTitle=config.company?.custom_names.region_plural;
      this.roleConfig = config.role?.modules;
      this.isAskQEnabled = config.company.is_askq === 1 ? true : false;
      this.isTimesheetEnabled = this.roleConfig.TimesheetManagement.enabled;
      this.isSchedulerEnabled = config.company.is_scheduler === 1 && this.roleConfig.Schedules.enabled;
      this.isOrganizationEnabled = this.roleConfig.OrganisationManagement.enabled;
      this.isAutomationEnabled = config.company.is_automation === 1 && this.roleConfig.AutomationManagement.enabled;
      this.isTaskEnabled =  config.company.is_tasks === 1 && this.roleConfig.Tasks.enabled;
      this.isRecognitionEnabled = config.company.is_rewards === 1 && this.roleConfig.Rewards.enabled;
      this.isCommunicationEnabled = config.company.is_communication === 1;
      this.isSettingsEnabled = this.roleConfig.Settings.enabled;
      this.isTimeOffEnabled = this.isSchedulerEnabled && config.company.is_timeoff == 1 ? true : false;
      this.openSwapEnabled = this.isSchedulerEnabled && (config.company.swap_manager_approval == 1 || config.company.open_manager_approval == 1) ? true : false;
			this.isRewardsGateway = config.company?.is_rewards_gateway == 1 ? true : false;
      this.isInteractiveCommunicationEnabled = config.company?.interactive_communication == 1 ? true : false;

      this.roleId=config.role.role_id;
       this.isPartner=config.is_partner;
      if (config.role.role_id === 2 || config.role.role_title.includes('Account Owner')) {
        this.isAccountOwner = true;
      }
      // this.isCommunicationEnabled = config.company.is_communication === 1 && this.roleConfig.Communication.enabled;
    })
    .finally(() => {
      this.getNotification();
      this.getRewardsNotification();
      this.isOrganizationEnabled ? this.getData() : ''; // calling for user count (AZAL-3688)
      if (this.dataService.getShowIntroBool() && !this.isAskQ) { //if first login
        this.isFirstLogin = true; 
        this.open('intro');
      }
      if (this.dataService.getShowHighlights() && !this.isAskQ) { //if first login
        // this.isFirstLogin = false; 
        this.isFirstLogin ? '' : this.open('whatNew');
      }
    });

    this.dataService.SharingRegionData.subscribe((res: any) => {
      this.selectedRegionId = res;
    });
    this.dataService.SharingRegionName.subscribe((res: any) => {
      this.selectedRegionName = res;
    });
    this.dataService.isRegionUpdated.subscribe((res: any) => {
      this.isRegionsUpdated=res;
    });
    this.dataService.SingleRegionId.subscribe((res: any) => {
      this.singleRegionId = res;
    });
    this.dataService.SingleRegionName.subscribe((res: any) => {
      this.singleRegionName = res;
    });
    this.dataService.recallNotifications.subscribe((res: any) => {
      this.getNotification(res);
    });
    this.dataService.recallRewardsNotifications.subscribe((res: any) => {
      this.getRewardsNotification(res);
    });


    this.dataService.allRegions.subscribe((res: any) => {
      res !== null ? (Object?.keys(res)?.length == 0 ? this.noRegions = true : this.noRegions = false) : ''
      if (this.noRegions) {
        this.navigateToSettings('/settings', 6);
      }
    });
    this.gs.userCount.subscribe((res: any) => {
      this.userCount = res;
    });
  }

  getNotification(hardReload = false) {
    if (this.isTimeOffEnabled || this.openSwapEnabled) {
      this.dataService.getSchedulerNotification(hardReload).then((noti) => {
        this.isSchedulerNotification = noti.time_off_notification_flag == 1 ? true : false;
        this.isOpenSwapNotification = noti.is_open_swap_notification == 1 ? true : false;
        this.stores = this.isSchedulerNotification ? noti.store_names : [];
        this.storesOpenSwap = this.isOpenSwapNotification ? noti.open_swap_store_names : [];
      });
    }
  }

  getRewardsNotification(hardReload = false) {
    if (this.isRecognitionEnabled && this.isRewardsGateway) {
      this.dataService.getRewardsNotification(hardReload).then((noti) => {
        this.isRewardsNotification = noti.rewardNotification == 1 ? true : false;
        this.storesRewardsNoti = this.isRewardsNotification ? noti.store_names : [];
      });
    }
  }

  ngOnInit(): void {
    this.isDesktopView = this.gs.isWidthLarge();
    this.selectedRegionName=this.storageService.getSharedRegionName();
    this.selectedRegionId=this.storageService.getSharedRegion();
    this.singleRegionName=this.storageService.getSingleRegionName();
    this.singleRegionId=this.storageService.getSingleRegionId();
    this.opacity = avatarOpacity;
    this.user$ = this.authService.user$;
    this.user$.subscribe(x=> {
      if (this.isCommunicationEnabled) { // if already on recognition module
        this.authService.updateRecognitionNotification();
      }
    });

    window.addEventListener("orientationchange", (event) => {
      // Announce the new orientation number
      this.tabOrientation = screen.orientation.type;
      this.isDesktopView = this.gs.isWidthLarge();
    }, false);


    //   this.user$ = this.authService.user$;
    // if (this.isCommunicationEnabled) {
    // //  console.log(this.isCommunicationEnabled,"this.isCommunicationEnabled");
    // //  this.user$ = this.authService.user$;
    // this.authService.updateRecognitionNotification();
    // }
    
    this.getProfileInfo();
    this.form= this.fb.group({
      region_id:null
    });
    this.showSideBar = false;
    this.userCount = 0;
  }
  getData() {
    this.loading = true;
    this.service.getUsersExist().then((response: any) => {
      this.gs.setUsersCount(response?.users_exist_flag);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      this.loading = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pathChanged'] && changes.pathChanged.currentValue !== changes.pathChanged.previousValue) {
      this.showStores = false;
      if (this.selectedRegionId == 0) {
        this.selectedRegionName = (this.index == 2 || this.index == 4 || this.index == 7) ? "Select store" : "All Stores";
        this.selectedRegionName = this.isAzalioPlayReports() ? 'All stores' : this.selectedRegionName
      }
      this.headerNavigation()
    }
  }

  switchToAskQ() {
    this.isAskQ ? this.router.navigate(['organization']) : this.router.navigate(['askq']);
    this.popover.hide();
  }

  isAzalioPlayReports() {
    if (this.index == 4 && this.router.url.includes('tasks/report')) {//tasks
      return true;
    }
    return false;
  }

  getProfileInfo() {
    const url = apiUrl.user.get.profileInfo;
    this.http.get(url).subscribe(
      (res: any) => {
        this.profileInfo = res.user_info;
        this.dataService.setCompanyName(res.user_info.company_title);
        this.dataService.setLoggedInUserId(res.user_info.user_id);
        this.dataService.setUserName(res.user_info.name);
        this.dataService.setLoggedInUserEmail(res.user_info.email);
        this.dataService.setRoleId(res.user_info.role_id);
        this.dataService.setLoggedInUserRole(res.user_info.role_title);
        let logRocketAppId;
        if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
          logRocketAppId = '50nqpl/azal';
        } else if (config.environment?.toLowerCase() === 'test' || config.environment?.toLowerCase() === 'demo') {
          logRocketAppId = 'b6qklu/local';
        }
        LogRocket.identify(logRocketAppId, {
          id: res.user_info.user_id,
          name: res.user_info.name,
          email: res.user_info.email,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCompanyName() {
    return this.dataService.getCompanyName();
  }

  async logout(): Promise<void> {
    this.analytics.logEvents("logout_button")
    await this.authService.signOut();
    this.router.navigate(['/home']);
    this.storageService.removeToken();
    this.dataService.setSharingRegionData(null,null);
    this.dataService.setSingleRegionData(null, null);
  }

  navigateToSettings(path, index) {
    this.index = index;
    this.router.navigate([path]);
  }

  navigate(path, index) {
    this.getNotification();
    this.getRewardsNotification();
    if (this.noRegions ) { //settings
      return;
    }
    this.index = index;
    this.router.navigate([path]);
  }

  goToAdminView() {
    this.router.navigate(['admin']);
    this.dataService.setConfigurations(null);
    this.dataService.setSharingRegionData(null,null);
    this.dataService.setSingleRegionData(null, null);
  }

  headerNavigation() {
    this.isAskQ = this.router.url.includes('askq') ? true : false;
    // this.getNotification();
    this.getRewardsNotification();
    if (this.router.url.includes('organization')) {
      this.analytics.logEvents("header_organization");
      this.index = 3;
    } else if (this.router.url.includes('scheduler')) {
      this.analytics.logEvents("header_scheduler");
      this.index = 2;
    } else if (this.router.url.includes('timesheet')) {
      this.analytics.logEvents("header_timesheets");
      this.index = 1;
    } else if (this.router.url.includes('recognition')) {
      this.analytics.logEvents("header_recognition");
      this.index = 7;
    } else if (this.router.url.includes('automation')) {
      this.analytics.logEvents("header_automation");
      this.index = 8;
    } else if (this.router.url.includes('communication')) {
      this.analytics.logEvents("header_messaging");
      this.index = 5;
    } else if (this.router.url.includes('settings')) {
      this.analytics.logEvents("header_settings");
      this.index = 6;
    } else if (this.router.url.includes('tasks')) {
      this.analytics.logEvents("header_tasks");
      this.index = 4;
    } else if (this.router.url.includes('survey')) {
      this.index = 9;
    }
  }

  temp: any = {
    intro: IntroModalComponent,
    whatNew:WhatNewModalComponent,
  };

  open(keyName, data = null) {
    this.analytics.logEvents("help_button")
    this.dialogService
      .open(this.temp[keyName], {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        context: { data: data },
      })
      .onClose.subscribe((item) => {
        if (this.isAccountOwner && this.isFirstLogin) {
          this.isAccountOwnerFirstLogin = true; //Turn on the flag after intro modal closes
        }
        if (item && item.email) {
          this.open(item.key, item);
        } else if (item) {
          this.open(item, null);
        }
      });
  }
  logoAnalysis() {
   // this.router.navigate(['/home']);
   this.analytics.logEvents('azalio_logo');
  }

  regionChange(event){
    this.dataService.updateRegion(false);
    this.dataService.setSharingRegionData(event?event.region_id:0, event?event.region_title:'' );
    this.storageService.setSharedRegion(event?event.region_id:0, event?event.region_title:'');
    if(event?.region_id==0){
      this.dataService.setSelectedFilter(null); 
    }else{
      this.dataService.setSelectedFilter({id: event?.region_id, type: 'Region', name:event?.region_title}); 
    }
  }
  oneStoreCompanyData(event){
    this.dataService.updateRegion(false);
    this.dataService.setSingleRegionData(event?event.region_id:0, event?event.region_title:'' );
    this.storageService.setSingleRegion(event?event.region_id:0, event?event.region_title:'');
    if(event){
      this.dataService.setSelectedFilter({id: event?.region_id, type: 'Region', name:event?.region_title});
    }
  }
  onClick(){
   // this.showStores=true;
   this.showSideBar=!this.showSideBar;
  }
  
  getGradients(index) {
    if (this.index !== index) {
      return '';
    }
   switch (index) {
    case 1://timesheet
    return 'radial-gradient(circle, #eff8ff, #e9f5ff, #e3f3ff, #ddf0ff, #d7edff)';
    case 2://scheduler
    return 'radial-gradient(circle, #fffdfc, #fff8f5, #fff4ef, #ffefe8, #ffeae2)';
    case 3://organization
    return 'radial-gradient(circle, #f3ffd3, #f3ffd4, #f4fed5, #f4fed7, #f4fdd8)';
    case 4://tasks
    return 'radial-gradient(circle, #f1fffd, #e7fdfa, #dcfcf7, #d1faf4, #c6f8f1)';
    case 5://communication
    return 'radial-gradient(circle, #f9f3f9, #f8f0f9, #f8edf8, #f7ebf8, #f6e8f8)';
    case 6://settings
    return 'radial-gradient(circle, #f4f3fb, #f3f2fc, #f2f0fd, #f1effe, #f0edff)';
    case 7://recognition
    return 'radial-gradient(circle, #fffaf3, #fff7e9, #fff3de, #fff0d4, #ffedca)';
    case 8://automation
    return 'radial-gradient(circle, #e8ffff, #e7ffff, #e5ffff, #e4ffff, #e2ffff)';
    case 9://communication ai survey
    return 'radial-gradient(circle, #dfe8ff, #e3ebff, #e6edff, #eaf0ff, #edf2ff)';
    default:
      return '';
   }
  }
}

