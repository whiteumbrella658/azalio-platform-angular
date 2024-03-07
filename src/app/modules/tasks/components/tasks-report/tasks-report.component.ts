import { Component, HostListener, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { TasksService } from '../../tasks.service';

@Component({
  selector: 'app-tasks-report',
  templateUrl: './tasks-report.component.html',
  styleUrls: ['./tasks-report.component.scss']
})
export class TasksReportComponent implements OnInit {
  selectedRow: any;
  hoveredRow: any;
  pageLoading: boolean;
  loading: boolean;
  subscriptioSingle: any;
  sharedRegion: any;
  singleRegion: any;
  subscription: any;
  searchText: any;
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  paginator: { page_no: number; page_size: number; total_records: number; };
  searchOn: any;
  pageEvent: any;
  emptySearchResults: boolean;
  filterInput: any;
  emptyResults: boolean;
  displayedColumns: string[] = ['user', 'name', 'datetime', 'points', 'shift', 'store', 'action'];
  opacity: number;
  revokeText: string;
  reason: string = null;
  isAzalioPlay: boolean;


  constructor(
    private service: TasksService,
    private router: Router,
    private dataService: DataSharedService,
    private gs: GeneralService
  ) {
    this.pageLoading = true;
    this.loading = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.Tasks?.enabled) {
        this.router.navigate(['401'])
      }
      this.isAzalioPlay = config?.company.is_azalio_play == 1 ? true : false;
    });
    // this.subscriptioSingle = this.dataService.SingleRegionId.subscribe((res: any) => {
    //   this.sharedRegion = res;
    //   this.singleRegion = res
    //   this.getData();
    // });

    if (!this.singleRegion) {
      this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
        this.sharedRegion = res;
        this.getData();
      });
    }
  }

  @HostListener('document:click')
  public onClick(targetElement) {
    setTimeout(() => {
      const el = document.getElementsByClassName('popup-card');
      const isPopup = el && el[0];
      if (!isPopup && this.selectedRow) {
        this.selectedRow = null;
      }
    });
  }
  getData() {
    this.filterInput = { 
      region_id: this.sharedRegion ? this.sharedRegion : null,
    }
    this.loading = true;
    this.service.getReportsTableData(this.searchText, this.pageEvent, this.filterInput)
      .then((response: any) => {
        this.dataSource.data = response.points;
        this.paginator = response.pagination;
        this.emptySearchResults = response.points?.length === 0 && this.searchText ? true : false;
        this.emptyResults = response.points?.length === 0 && !this.searchText ? true : false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
  }

  setRevokeData(el) {
    this.selectedRow = el;
    this.revokeText = "You're about to <span class='point-details'>revoke <img src='assets/coin.png'> " + el.points + " points </span> earned by <b>" +
     el.user_name + "</b>. Are you sure?";
  }

  revokePointsWithComment(data, pointsId) {
    this.reason = data.reason && data.reason !== '' ? data.reason : null;
    this.revokePoints(data.isChecked, pointsId);
  }

  revokePoints =  async (isUndone, pointsId) => {
    this.loading = true;
    const data = {
      points_id: pointsId,
      is_undone: isUndone ? 1 : 0,
      is_revoked: 1
    }
    if (this.reason) {
      Object.assign(data, {reason: this.reason})
    }
    try {
      const response: any = await this.service.revokePoints(data);
      this.gs.showToastSuccess(response?.message);
      this.reason = null;
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.selectedRow = null;
      this.loading = false;
    }
  }

  onSearch(searchText) {
    this.gs.logEvents('search_from_tasks_report')
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

  // navigateToTasks() {
  //   this.router.navigate(['tasks']);
  // }

  navigateTo(route) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.opacity = avatarOpacity;
    this.gs.hideSplashScreen();
  }

  
  ngOnDestroy() {
		this.subscription?.unsubscribe();
    this.subscriptioSingle?.unsubscribe();
	}

}

export interface PeriodicElement {
  name: string;
  last_known_status: string;
  action: any;
}

