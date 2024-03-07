import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { AdminService } from '../../admin.service';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';
import { PeriodicElement } from '../customer-page/customer-page.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
	displayedColumns: string[] = ['name', 'role', 'regionsAndTeams', 'email', 'phone_number', 'status', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>([]);
	loading: boolean;
	paginator: any;
	pageEvent: PageEvent;
	searchText: any;
	emptySearchResults: boolean;
	emptyResults: boolean;
	searchOn: any;
	companyName: string;
	opacity: number;
	companyId: string;
	regions: any;

  constructor(
	private dialogService: NbDialogService,
	private router: Router,
	private gs: GeneralService, 
	private service: AdminService) { 
	this.opacity = avatarOpacity;
	}

  ngOnInit(): void {
	this.setCompanyName();
    this.gs.hideSplashScreen();
    this.getData();
  }

  setCompanyName() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	this.companyName = urlParams.get('name');
	this.companyId = urlParams.get('id');
  }

  onSearch(searchText) {
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

  back() {
	this.router.navigate(['admin']);
  }

  openModal(el) {
	this.dialogService.open(ResetPasswordComponent, {
		hasBackdrop: true, closeOnBackdropClick: false, context: {
		  user: el,
		  companyId: this.companyId
		}
	  }).onClose.subscribe((refresh) => {
	  });
  }

  OnHover(element){
	this.regions = element?.regions?.map((region)=>region.region_title).join(', ');
 }	

  getData() {
	this.loading = true;
	this.dataSource.data = null;
	this.service.getUsersTableData(this.searchText, this.pageEvent)
		.then((response) => {
			this.dataSource.data = response.users;
			this.paginator = response.pagination;
			this.emptySearchResults = response.users?.length === 0 && this.searchText ? true : false;
			this.emptyResults = response.users?.length === 0 && !this.searchText ? true : false;
		})
		.catch((error) => {
			console.log(error);
		})
		.finally(async () => {
			this.loading = false;
		});
	}
}

