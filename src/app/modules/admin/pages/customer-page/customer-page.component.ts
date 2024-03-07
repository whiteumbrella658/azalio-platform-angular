import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { AdminService } from '../../admin.service';
import { EnablePlayComponent } from '../../components/enable-play/enable-play.component';
import { ImportTasksComponent } from '../../components/import-tasks/import-tasks.component';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.scss']
})
export class CustomerPageComponent implements OnInit {
  loading: boolean;
  searchOn: string;
  searchText: string;
  pageEvent: PageEvent;
  paginator: any;
  emptySearchResults: boolean;
  emptyResults: boolean;
  displayedColumns: string[] = ['company', 'ownerName', 'ownerEmail', 'ownerPhone', 'signedOn', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  opacity: number;
  pageLoading: boolean;
  isTableModePlay: boolean;
  loadingBtn: boolean;
  selectedLinkId: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataSharedService,
    private router: Router,
    private storageService: LocalStorageService,
    private service: AdminService,
    private gs: GeneralService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.isTableModePlay = false;
    this.gs.hideSplashScreen();
    this.getData();
  }
  onSearch(searchText) {
    this.gs.logEvents('search_customer_page')
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

  viewCustomer(company) {
    this.dataService.setAllRegions(null);
    this.dataService.setTagsCache(null);
    this.dataService.setNotiCache(null);
    this.dataService.setRewardsNotiCache(null);
    this.storageService.companyId = company.company_id;
    company.is_askq == 1 ? this.router.navigate(['askq']) : this.router.navigate(['organization']);
  }

  viewCompanyUsers(company) {
    this.router.navigate(['company-users'], {
      relativeTo: this.route,
      queryParams: { 'id': company.company_id, 'name': company.company_name },
      queryParamsHandling: 'merge', skipLocationChange: false
    });
  }

  toggleTable() {
    this.isTableModePlay = !this.isTableModePlay;
    if (this.isTableModePlay) {
      this.displayedColumns = ['company', 'ownerName', 'ownerEmail', 'askQ', 'tasksDashboard', 'aiSurvey', 'boringPlay', 'smsFlag', 'play', 'pinLength', 'importTasks', 'export'];
    } else {
      this.displayedColumns = ['company', 'ownerName', 'ownerEmail', 'ownerPhone', 'signedOn', 'action'];
    }
  }

  getData() {
    this.loading = true;
    this.service.getCustomerTableData(this.searchText, this.pageEvent)
      .then((response) => {
        this.dataSource = response.companies;
        this.paginator = response.pagination;
        this.emptySearchResults = response.companies?.length === 0 && this.searchText ? true : false;
        this.emptyResults = response.companies?.length === 0 && !this.searchText ? true : false;
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
  }

  async updateBoring2Fun(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: el.company_id,
      is_boring2Fun: el.boring2Fun == 0 ? 1 : 0,
    }
    try {
      const response: any = await this.service.updateBoring2Fun(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      el.is_azalio_play = !el.is_azalio_play;
      console.log(error)
    } finally {
      this.loading = false;
    }

  }

  async updateDashboardFlag(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: el.company_id,
      is_dashboard: el.is_dashboard == 0 ? 1 : 0,
    }
    try {
      const response: any = await this.service.updateDashboardFlag(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      el.is_dashboard = !el.is_dashboard;
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async updateAskQ(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: el.company_id,
      is_askq: el.is_askq == 0 ? 1 : 0,
    }
    try {
      const response: any = await this.service.updateAskQFlag(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      el.is_askq = !el.is_askq;
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async updateSMSFlag(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: el.company_id,
      is_sms_checkbox: el.is_sms_checkbox == 0 ? 1 : 0,
    }
    try {
      const response: any = await this.service.updateSMSFlag(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      el.is_sms_checkbox = !el.is_sms_checkbox;
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }


  async updateAISurveyFlag(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: el.company_id,
      is_ai_survey: el.is_ai_survey == 0 ? 1 : 0,
    }
    try {
      const response: any = await this.service.updateInteractiveCommunicationFlag(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      el.is_ai_survey = !el.is_ai_survey;
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async revokePlay(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: el.company_id,
      is_azalio_play: 0,
      azalio_play_user_pin_length: el.azalio_play_user_pin_length,
      azalio_play_user_pin_autogenerate: el.azalio_play_user_pin_autogenerate
    }
    try {
      const response: any = await this.service.updateCustomerSettings(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async linkCompany(el) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.selectedLinkId = el.company_id;
    const data = {
      company_id: el.company_id
    }
    try {
      const response: any = await this.service.linkCompany(data);
      data['public_token'] = response?.linkToken;
      this.connectToMerge(data);
    } catch (error) {
      this.selectedLinkId = null;
      this.gs.showToastError(error.message);
      console.log(error)
      this.loading = false;
    } finally {
    }
  }

  async connectToMerge(data) { //save link token
    try {
      const response: any = await this.service.saveLinkToken(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.selectedLinkId = null;
      this.loadingBtn = false;
      this.loading = false;
    }
  }

  showImport(el) {
    this.dialogService.open(ImportTasksComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: {
        companyId: el.company_id
      }
    }).onClose.subscribe((refresh) => {
    });
  }

  openModal(el) {
    this.dialogService.open(EnablePlayComponent, {
      hasBackdrop: true, closeOnBackdropClick: false, context: {
        companyId: el.company_id
      }
    }).onClose.subscribe((refresh) => {
      if (refresh) {
        this.getData();
      }
    });
  }

  exportPins(el) {
    this.loading = true;
    this.service.exportUsers({ companyId: el.company_id })
      .then((response: any) => {
        this.gs.exportAsExcelFile(response.csv, "Company Users");
      })
      .catch((error) => {
        this.gs.showToastError(error.message);
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}

export interface PeriodicElement {
  company: string;
  ownerName: string;
  ownerEmail: string;
  signedOn: Date;
  action: any;
}
