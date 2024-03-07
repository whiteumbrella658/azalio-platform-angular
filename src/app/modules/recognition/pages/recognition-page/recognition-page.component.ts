import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { RecognitionService } from '../../recognition.service';
import { AuthService } from 'src/app/core/services/auth.service';
import {FirestoreService} from 'src/app/core/services/firestore.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-recognition-page',
  templateUrl: './recognition-page.component.html',
  styleUrls: ['./recognition-page.component.scss']
})
export class RecognitionPageComponent implements OnInit {
  filterOn: any;
  showHelperButton: boolean;
  searchContext: boolean;
  loading: boolean;
  showFilterResponsive: boolean;
  goals: any;
  // manualPoints: any;
  // isManualRecognitionEnabled: boolean;
  // user$: Observable<any>;
  webUserName: any;
  isStore: any;
  subscriptioSingle: any;
  sharedRegion: any;
  singleRegion: any;
  subscription: any;
  isAzalioPlay: boolean;
  showBadges: boolean;
  isBoringPlay: boolean;
  // prefShowRegionFilter: boolean;

  constructor(
    private dataService: DataSharedService,
    private gs: GeneralService,
    private service: RecognitionService,
    private router: Router,
    private authService: AuthService,
    private analytics: FirestoreService
  ) { 
    this.dataService.getConfigurations(false).then((config) => {
			this.isAzalioPlay = config.company?.is_azalio_play === 1 ? true : false;
    });
    this.subscriptioSingle = this.dataService.SingleRegionId.subscribe((res: any) => {
      if (res !== null && res > 0) {
        this.isStore = true; //if single region, display store.
      }
		});

		if (!this.singleRegion) {
			this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
				this.sharedRegion = res;
        if (this.sharedRegion != 0) {
          this.isStore = true;
        }			
      });
		} else {
      this.isStore = true;
    }
  }

  ngOnInit(): void {
    this.showBadges = true;
    // this.isStore = false;
    // this.user$ = this.authService.user$;
    // this.authService.updateRecognitionNotification();
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.Rewards?.enabled || config.company?.is_rewards !== 1) {
        this.router.navigate(['401']) 
        return;
      }
      this.webUserName = this.dataService.getUserName();
      // this.prefShowRegionFilter = config.user_preferences?.show_region_filter ? true : false;
      // this.isManualRecognitionEnabled = config.company.is_manual_recognition === 1 ? true : false;
      // if (this.isManualRecognitionEnabled) {
      //   this.extractManualPoints();
      // }
    }).finally(() => {
    });
    // this.showFilterResponsive = false;
    this.getGoalsData();
    this.gs.hideSplashScreen();
  }

  onTabChange($event) {
    this.showBadges = $event;
  }

  onFilterChange(value) {
    this.filterOn = value;
    this.showHelperButton = true;
    this.searchContext = value ? false : true;
  }

  onClear() {
    this.filterOn = null;
    this.searchContext = true;
    this.showHelperButton = false;
  }

  getGoalsData() {
    this.loading = true;
    this.service.getGoals()
      .then((response) => {
        this.goals = response.badges;
        this.service.setDefaultBadges(this.goals);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // extractManualPoints() {
  //   const result = this.goals.filter(x=> x.type === 'manual_recognition');
  //   if (result.length > 0) {
  //     this.manualPoints = result[0].points;
  //   }
  // }

  // updatePreferences() {
  //   this.analytics.logEvents("side_panel_expand");
  //   this.prefShowRegionFilter = !this.prefShowRegionFilter;
  //   this.dataService.savePreferences({'show_region_filter': this.prefShowRegionFilter}).then((response: any) => {
  //   }).catch((error) => {
  //     console.log(error);
  //   })
  //   .finally(() => {
  //   });
  // }


}
