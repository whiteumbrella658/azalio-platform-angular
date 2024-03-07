import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { apiUrl } from 'src/api-url';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { TasksService } from '../../tasks.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {
  displayedColumns: string[] = ['task', 'status', 'comment', 'picture'];
  shifts: any[];
  selectedShift: any
  data: any;
  opacity: number;
  selectedDate: Date;
  pageLoading: boolean;
  loading: boolean;
  singleRegion: any;
  sharedRegion: any;
  subscription: any;
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  filterInput: { region_id: any; shift_id: any, all_shifts: boolean};
  emptySearchResults: boolean;
  emptyResults: boolean;
  searchText: string;
  pageEvent: { pageIndex: number; pageSize: number; };
  subscriptioSingle: any;
  allShift: { id: any; shift_name: string; icon: string; };
  searchOn: any;
  fileDownloading: any;

  constructor(
    private service: TasksService,
    private gs: GeneralService,
    private router: Router,
    private dataService: DataSharedService
  ) { 
    // this.pageLoading = true;
    this.selectedDate = new Date();
    this.allShift = {
      id: null,
      shift_name: "All shifts",
      icon: null,
   },
    this.pageLoading = true;
    this.loading = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.Tasks?.enabled) {
        this.router.navigate(['401'])
      }
    });

    // this.subscriptioSingle = this.dataService.SingleRegionId.subscribe((res: any) => {
    //   this.sharedRegion = res;
    //   this.singleRegion = res
    //   // this.resetShiftFilter();
    //   // if (this.selectedFilterItem) {
    //   //     this.getData();
    //   // }
    //   this.selectedShift = null;
    //   this.getData();
    //   }); 
   

    if (!this.singleRegion) {
      this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
        this.sharedRegion = res;
        this.selectedShift = null;
        this.getData();
      });
    }
  }

  ngOnInit(): void {
    // this.pageLoading = true;
    // this.loading = false;
    // this.dataService.getConfigurations(false).then((config) => {
    //   if (!config.role.modules?.Tasks?.enabled) {
    //     this.router.navigate(['401'])
    //   }
    // });

    // if (!this.singleRegion) {
    //   this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
    //     this.sharedRegion = res;
    //     this.getData();
    //   });
    // }
    this.opacity = avatarOpacity;
    this.gs.hideSplashScreen();

}

  getData() {
    this.pageLoading = false;
    this.loading = true;
    if (!this.selectedDate || !this.sharedRegion) {
      return;
    }

    this.filterInput = { 
      region_id: this.sharedRegion ? this.sharedRegion : null,
      shift_id: this.selectedShift ? this.selectedShift.id : null,
      all_shifts: this.selectedShift && this.selectedShift.id == null ? true : false
    }
    this.loading = true;
    this.service.getDailyReportsTableData(this.searchText, this.gs.convertToLocalDateString(this.selectedDate), this.filterInput)
      .then((response: any) => {
        this.shifts = response.shifts;
        this.shifts.unshift(this.allShift);
        if (!this.selectedShift) {
          this.selectedShift = this.shifts[1];
        }
        this.data = response.tasks;
        // if (this.data[0]) {
        //   this.data[0].image_url = 'http://localhost:3000/api/global/getPhotoWeb?id=e1ed9157-0c69-4642-b1ae-a66ed39f5846&full=0'
        // }
        // this.paginator = response.pagination;
        this.emptySearchResults = response.tasks?.length === 0 && this.searchText ? true : false;
        this.emptyResults = response.tasks?.length === 0 && !this.searchText ? true : false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.scrollToTop();
        this.pageLoading = false;
        this.loading = false;
      });
  }

  onSearch(searchText) {
    this.gs.logEvents('search_from_daily_report')
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    // if (this.pageEvent) {
    //   this.pageEvent.pageIndex = 0;
    // }
    this.getData();
  }

  onSearchAll(searchText) {
    this.gs.logEvents('search_from_daily_report')
    this.searchOn = searchText.trim();
  }

  setDate(date) {
    this.selectedDate = date;
    this.getData();
  }

  getStatusClass(el) {
    if (!el.modification) {
      return;
    }
    if (el.modification.includes('undone')) {
      return 'undone';
    }
    else if (el.modification.includes('done')) {
      return 'done';
    }
    return 'comment';
  }

  selectShift(shift) {
    this.selectedShift = shift;
    this.getData();
    if (shift.id == null) {
      this.displayedColumns = ['task', 'shift', 'status', 'comment', 'picture'];
    } else {
      this.displayedColumns = ['task', 'status', 'comment', 'picture'];
    }
  }

  navigateTo(route) {
    this.router.navigate([route]);
  }

  scrollToTop() {
    const elem = document.getElementById('daily-report');
    if (elem) {
      elem.scrollTop = 0;
    }
  }

  downloadDailyReport() {
    // let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let url = apiUrl.tasks.get.downloadTaskReport + '?date=' + this.gs.convertToLocalDateString(this.selectedDate) +
    '&region_id=';
    url += this.sharedRegion ? this.sharedRegion : null;
    if (!this.fileDownloading) { //multiple clicks handled
      this.fileDownloading = true;
      this.service.getPdf(url)
        .toPromise()
        .then(res => {
          const byteArray = new Uint8Array(atob(res).split('').map(char => char.charCodeAt(0)));
          this.gs.saveAsPdf(new Blob([byteArray], { type: 'application/pdf' }), 'DailyReport');
        }).catch(error => {
          this.gs.showToastError(error);
        }).finally(() => {
          this.fileDownloading = false;
        });
      }
   }
    
  ngOnDestroy() {
		this.subscription?.unsubscribe();
    this.subscriptioSingle?.unsubscribe();
	}

}

export interface PeriodicElement {
}
