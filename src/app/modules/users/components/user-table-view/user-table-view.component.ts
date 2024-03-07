import {
	AfterViewChecked,
	ChangeDetectorRef,
	Output,
	EventEmitter,
	Component,
	Input,
	OnInit,
	SimpleChanges,
	ViewChild,
	OnChanges,
	OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NbDialogService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../user.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, pageSizeOptions, paginatorOptions } from 'src/constants';
import { AddUserComponent } from '../add-user/add-user.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import {FirestoreService} from 'src/app/core/services/firestore.service';
import { FormBuilder } from '@angular/forms';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';
import { AddLabelComponent } from '../add-label/add-label.component';

@Component({
	selector: 'app-user-table-view',
	templateUrl: './user-table-view.component.html',
	styleUrls: ['./user-table-view.component.scss'],
})
export class UserTableViewComponent implements OnInit, AfterViewChecked,OnChanges,OnDestroy {
	displayedColumns: string[] = ['name', 'role', 'regionsAndTeams', 'email', 'phone_number', 'status'];
	dataSource = new MatTableDataSource<PeriodicElement>([]);

	@ViewChild(MatPaginator) MatPaginator: MatPaginator;
	@ViewChild('emailFilter') emailFilter;
	@ViewChild('phoneFilter') phoneFilter;
	@ViewChild('emailFilterResp') emailFilterResp;
	@ViewChild('phoneFilterResp') phoneFilterResp;

	@Input() searchText;
	@Input() filterData;
	@Input() checked;
	@Input() selectedTab:string;
	@Input() type: string;
	@Input() action: string;
	@Output() totalUsers: EventEmitter<number> = new EventEmitter();
	@Output() selectionUser: EventEmitter<boolean> = new EventEmitter();
	@Output() callRegionHierarchy: EventEmitter<boolean> = new EventEmitter();
	textMessage:string;
    regions: any; 
	data: any;
	paginator: any;
	pageEvent: PageEvent;
	selectedUserName: string;
	selectedRowData: any;
	usersData: any;
	pageSizes: any;
	loading: boolean;
	filterInput: any;
	emptySearchResults: boolean;
	emptyResults: boolean;
	selectAll: boolean;
	selection: SelectionModel<any>;
	nameConfig: any;
	regionConfig: any;
	teamConfig: any;
	opacity: number;
	isTeam: boolean;
	sharedRegion:number=0;
	isActive:any;
	check:number=0;
	subscription:any;
	animation:string;
	animation2: string;
	form: any;
	roles: any;
	filters: { role: any; email: string, phone: string, name_sort: Number, tag: any };
	isFiltered: {role: boolean; email: boolean, phone: boolean, tag: boolean};
	defaultOpen: boolean = true;
	defaultOpen2: boolean = true;
	tags: { id: number; tag: string; color: string; }[];
	constructor(
		private http: ApiService,
		private fb: FormBuilder,
		private dialogService: NbDialogService,
		private dataService: DataSharedService,
		private cdRef: ChangeDetectorRef,
		private service: UserService,
		public gs: GeneralService,
		private analytics: FirestoreService,
	) {
		this.filters = {role: null, email: null, phone: null, name_sort: 1, tag: null};
		this.pageSizes = pageSizeOptions;
		this.dataService
			.getConfigurations(false)
			.then((config) => {
				this.nameConfig = config.company?.custom_names;
				this.regionConfig = this.nameConfig?.region_plural;
				this.teamConfig = this.nameConfig?.team_plural;
				this.isTeam = config.company?.is_team === 1 ? true : false;
			})
			.finally(() => {});
			this.subscription=this.dataService.SharingRegionData.subscribe((res: any) => {
				this.sharedRegion = res;

				this.getData();
			});

		this.dataService.getRoles(false).then((roles) => {
			this.roles = roles;
		}).finally(() => {});
			
		this.dataService.getCompanyUserTags(false).then((tags) => {
			this.tags = tags;
		});
	}

	ngOnInit(): void {
		this.filters = {role: null, email: null, phone: null, name_sort: 1, tag: null};
		this.isFiltered = {role: false, email: false, phone: false, tag: false};
		this.opacity = avatarOpacity;
		this.paginator = paginatorOptions;
		this.selectedUserName = null;
		this.gs.showBackDrop(false);	
		this.isActive=null;	
		this.animation='organization';
		this.textMessage='Get started by adding users to your store.'

		this.form = this.fb.group({
			role: [],
			tag: [], //employee tags
			email: [],
			phone: []
		})
	}

	closeFilter(key) {
		this.form.controls[key].setValue(this.filters?.[key]);
	}

	onSort(val, key) {
		this.gs.logEvents('organisation_page_' + key);
		this.filters[key] = val;
		this.getData();
	}

	onEnter(key) {
		this[key].applyEnter();
	}

	applyFilterMulti(key) {
		this.gs.logEvents('users_filtered_by_' + key + '_organisation')
		let val = this.form.controls[key].value;
		if (val && val.length > 0) {
			this.isFiltered[key] = true;
			this.filters[key] = val;
		} else {
			this.filters[key] = null;
			this.isFiltered[key] = false;
		}
		this.getData();
	}

	applyFilter(key) {
		this.gs.logEvents('users_filtered_by_' + key + '_organisation')
		let val = this.form.controls[key].value;
		if (val && val.length > 0) {
			this.isFiltered[key] = true;
			this.filters[key] = val;
		} else {
			this.filters[key] = null;
			this.isFiltered[key] = false;
		}
		this.getData();
	}

	removeFilter(key) {
		this.filters[key] = null;
		this.isFiltered[key] = false;
		this.getData();
	}

	initSelection() {
		const initialSelection = [];
		const allowMultiSelect = true;
		this.selection = new SelectionModel<any>(allowMultiSelect, initialSelection);
	}

	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	}

	ngOnChanges(changes: SimpleChanges) {
		let callGetData = false;
		if (changes['selectedTab'] && changes.selectedTab.currentValue !== changes.selectedTab.previousValue) {
			this.dataSource.data = null;
			this.animation ='timesheet';
			this.animation2 = null;
			this.textMessage = 'No active users.';
			if (this.selectedTab === 'all_users') {
				this.animation = 'organization';
				this.animation2 = 'arrowBottom';
				this.textMessage = 'Get started by adding users to your store.';
			} else if (this.selectedTab === 'pending_users') {
				this.textMessage = 'No pending users.';
			}
			callGetData = true;
		}
		if (changes['searchText'] && changes.searchText.currentValue !== changes.searchText.previousValue) {
			if (this.pageEvent) {
				this.pageEvent.pageIndex = 0;
			}
			callGetData = true;
		} else if (changes['filterData'] && changes.filterData.currentValue !== changes.filterData.previousValue) {
			this.filterInput = changes.filterData.currentValue;
			callGetData = true;
		}
		setTimeout(() => {
			if (callGetData) {
				this.getData();
			}
		});

	}

	numberOfUsers(totalResults: number) {
		this.totalUsers.emit(totalResults);
	}

	resendInvite(userId, type) {
		this.analytics.logEvents("resend_email");
		this.loading = true;
		const data = {
			user_id: userId,
			resend_mobile_invite: type === 'mobile' ? true : false,
			resend_web_invite: type === 'web' ? true : false,
		};
		this.service
			.resendInvite(data)
			.then((response: any) => {
				this.gs.showToastSuccess(response?.message);
			})
			.catch((error) => {
				console.log(error);
				this.gs.showToastError(error?.message);
			})
			.finally(() => {
				this.loading = false;
			});
	}

	// sendCountData() {
	// 	const isAssignUser = this.type === 'job-assign-user' ? true : false;
	// 	this.dataService.updateSelectionCount(this.selection?.selected?.length, isAssignUser);
	// }
 
	// onAssignmentSuccess() {
	// 	this.dataService.onAssignmentSuccess(true);
	// }

	//Selection code starts here
	// onMasterToggle(checked) {
	// 	this.gs.onMasterCheckboxToggle(checked, this.dataSource, this.selection);
	// 	this.sendCountData();
	// }

	// updateMasterSelection() {
	// 	if (this.selection) {
	// 		this.selectAll = this.gs.updateMasterCheckbox(this.dataSource.data, this.selection.selected);
	// 		this.sendCountData();
	// 	}
	// }

	// updateRowSelection(row) {
	// 	this.selection.toggle(row.id);
	// 	this.updateMasterSelection();
	// }

	// clearSelection() {
	// 	this.selection.clear();
	// 	this.selectAll = false;
	// 	this.sendCountData();
	// }

	// toggle() {
	// 	this.sidebarService.toggle(false, 'detail');
	// }

	openLabelModal(element) {
		if (element.is_empty) {
			return;
		}
		this.selectedRowData = element;
		this.dialogService
			.open(AddLabelComponent, { hasBackdrop: true, closeOnBackdropClick: false, context: { userDetails: element } })
			.onClose.subscribe((refresh) => {
				if (refresh) {
					this.getData();
				}
			});
	}


	selectRow(element) {
		if (element.is_empty) {
			return;
		}
		this.selectedRowData = element;
		this.dialogService
			.open(AddUserComponent, { hasBackdrop: true, closeOnBackdropClick: false, context: { userDetails: element } })
			.onClose.subscribe((data) => {
				if (data) {
					if (data.refresh) {
						this.getData();
						this.getAllUsersCount();
					}
					this.callRegionHierarchy.emit();
				}
			});
	}

	getData() {
		if (this.selectedTab == null) {
			return;
		}
		this.dataSource.data=null;
		if (this.sharedRegion != null) {
			this.filterInput = { 'region_id': this.sharedRegion }
			this.loading = true;
			const isActive = this.selectedTab === 'active_users' ? 1 : this.selectedTab === 'pending_users' ? 0 : null;
			this.displayedColumns =
				isActive == 1 || isActive == 0
					? ['name', 'role', 'regionsAndTeams', 'email', 'phone_number']
					: ['name', 'role', 'regionsAndTeams', 'email', 'phone_number', 'status'];

		this.service
			.getUsersTableData(isActive, this.searchText, this.pageEvent, this.filterInput, this.filters)
			.then((response) => {
				this.dataSource.data = response.users;
				this.paginator = response.pagination;
				this.numberOfUsers(response.total);
				let filtered = false;
				for (const key in this.isFiltered) {
					if (this.isFiltered[key] == true) {
						filtered = true;
						break;
					}
				  }
				this.emptySearchResults = response.users?.length === 0 && (this.searchText || filtered)  ? true : false;
				this.emptyResults = response.users?.length === 0 && (!this.searchText && !filtered) ? true : false;
				//this.updateMasterSelection();
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(async () => {
				this.loading = false;
			});
		}
	}

	getAllUsersCount() {
		this.loading = true;
		this.service.getUsersExist().then((response: any) => {
			this.gs.setUsersCount(response?.users_exist_flag);
		}).catch((error) => {
			console.log(error);
		}).finally(() => {
			this.loading = false;
		});
	}

	OnHover(element){
		this.regions=element?.regions?.map((region)=>region.region_title).join(', ');
	}	
	ngOnDestroy() {
		this.subscription?.unsubscribe();
	  }
}

export interface PeriodicElement {
	name: string;
	role: string;
	regionsAndTeams: string;
	email: string;
	phone_number: string;
	status: string;
}
