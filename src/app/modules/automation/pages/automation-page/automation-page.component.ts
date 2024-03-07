import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AddAutomationComponent } from '../../components/add-automation/add-automation.component';
import { AutoTableComponent } from '../../components/auto-table/auto-table.component';

@Component({
  selector: 'app-automation-page',
  templateUrl: './automation-page.component.html',
  styleUrls: ['./automation-page.component.scss']
})
export class AutomationPageComponent implements OnInit {
  subscriptioSingle: any;
  isStore: boolean;
  singleRegion: any;
  sharedRegion: any;
  subscription: any;
  contactText: any = "Please contact us on <a href='mailto:customersupport@azal.io'>customersupport@azal.io</a> to get added in the queue for this feature."
  noSchedulerText: any = "Looks like you don't have <b>Scheduler Module</b> enabled. Please enable <a href='settings/required-features'>here</a> " +
  "to get access to this feature."
  noSchedulerRoleText: any = "Looks like you don't have access to <b>Scheduler Module</b>. Please enable <a href='settings/roles-permissions'>here</a> for your role to get access to this feature."
  @ViewChild(AutoTableComponent) autoTableInst: AutoTableComponent;
  isSchedulerEnabled: any;
  isSettingsEnabled: any;
  schedulerEnabled: { company: boolean; role: boolean; };

  constructor(
    private router: Router,
    private dataService: DataSharedService,
    private gs: GeneralService,
    private dialogService: NbDialogService
  ) { 
    this.subscriptioSingle = this.dataService.SingleRegionId.subscribe((res: any) => {
      if (res !== null && res > 0) {
        this.isStore = true; //if single region, display store.
        this.singleRegion = res;
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

  setText() {
    if (this.isSettingsEnabled) {
      if (!this.schedulerEnabled.company) {
        return this.noSchedulerText;
      }
      if (!this.schedulerEnabled.role) {
        return this.noSchedulerRoleText;
      }
    }

    return "Looks like you don't have <b>Scheduler Module</b> enabled. Please contact your administrator to get access to this feature.";
  }

  ngOnInit(): void {
    // this.isStore = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.AutomationManagement?.enabled) {
        this.router.navigate(['401'])
      }
      this.isSchedulerEnabled =  config.company.is_scheduler === 1 && config.role.modules.Schedules.enabled ? true : false;
      this.schedulerEnabled = {company: config.company.is_scheduler === 1 ? true : false, role: config.role.modules.Schedules.enabled ? true : false }
      this.isSettingsEnabled =  config.company.is_settings === 1 && config.role.modules.Settings.enabled ? true : false;
    }).finally(() => {
    });
    this.gs.hideSplashScreen();
  }

  openAddModal() {
    const regionId = this.sharedRegion || this.singleRegion;
		this.dialogService.open(AddAutomationComponent, {
			hasBackdrop: true,
			closeOnBackdropClick: false,
			context: { regionId: regionId },
		}).onClose.subscribe((isRefresh) => {
			if (isRefresh) {
				this.autoTableInst.getData(); 
			}
		});
	}

}
