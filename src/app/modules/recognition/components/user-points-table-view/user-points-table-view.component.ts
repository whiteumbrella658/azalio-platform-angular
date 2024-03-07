import { Component, Input, OnInit, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { NbDialogService } from '@nebular/theme';
import { RecognitionService } from '../../recognition.service';
import { ExtraPointsComponent } from '../extra-points/extra-points.component';
import { NewRewardComponent } from '../new-reward/new-reward.component';
import { avatarOpacity, pageSizeOptions } from 'src/constants';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { NewAnnouncementComponent } from '../new-announcement/new-announcement.component';

@Component({
	selector: 'app-user-points-table-view',
	templateUrl: './user-points-table-view.component.html',
	styleUrls: ['./user-points-table-view.component.scss'],
})
export class UserPointsTableViewComponent {
	displayedColumns: string[] = ['name', 'badges', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>([]);
	loading: boolean;
	searchText: any;
	filterInput: any;
	pageEvent: PageEvent;
	paginator: any;
	pageSizes: number[];
	searchOn: any;
	showHelperButton: boolean;
	searchContext: boolean;
	emptyResults: boolean;
	emptySearchResults: boolean;
	subscriptioSingle: any;
	sharedRegion: any;
	singleRegion: any;
	subscription: any;
	opacity: number;
	maxNumberOfBadges: number;
	isAzalioPlay: boolean;
	selectedTab: string;
	resetText: string = "You're about to <b> permanently reset </b> points earned by all users. Are you sure?";
	resetDate: any;
	permissions: any;
	lastAnnouncement: any;
	pageLoading: boolean;  
	@Output() onTabChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	isBoringPlay: boolean;
	showSideBar: boolean;
	isRewardsGateway: any;
	isRewardsNoti: boolean;

	constructor(
		private gs: GeneralService,
		private analytics: FirestoreService,
		private dataService: DataSharedService,
		private service: RecognitionService,
		private dialogService: NbDialogService) {
		this.maxNumberOfBadges = this.service?.maxNumberOfBadges;
		this.dataService.getConfigurations(false).then((config) => {
			this.selectedTab = '';
			this.isAzalioPlay = config.company?.is_azalio_play === 1 ? true : false;
			this.isBoringPlay = config.company?.boring2Fun === 1 ? true : false;
			this.isRewardsGateway = config.company?.is_rewards_gateway == 1 ? true : false;
			this.permissions = config.permissions;
		}).finally(() => {
			if (this.isRewardsGateway && (this.isBoringPlay || this.isAzalioPlay)) {
				this.displayedColumns = ['name', 'points', 'badges', 'gifts', 'action']
			}
			else if (this.isAzalioPlay || this.isBoringPlay) {
				this.pageLoading = true;
				this.maxNumberOfBadges = this.maxNumberOfBadges > 5 ? 5 : this.maxNumberOfBadges;
				this.displayedColumns = ['name', 'rank', 'points', 'badges', 'action']
			}
		});
		this.pageSizes = pageSizeOptions;
		this.opacity = avatarOpacity;
		this.subscriptioSingle = this.dataService.SingleRegionId.subscribe((res: any) => {
			this.sharedRegion = res;
			this.singleRegion = res
			if (this.pageEvent) {
				this.pageEvent.pageIndex = 0;
			}
			this.selectedTab = 'current_store';
			this.getData();
		});

		if (!this.singleRegion) {
			this.subscription = this.dataService.SharingRegionData.subscribe((res: any) => {
				this.sharedRegion = res;
				if (this.pageEvent) {
					this.pageEvent.pageIndex = 0;
				}
				this.selectedTab = 'current_store';
				this.getData();
			});
		}
	}
	ngOnInit() {
		setTimeout(() => {
			this.selectedTab = 'current_store';
		}, 2);
	}

	async resetPoints() {
		if (this.loading) {
			return;
		}
		this.loading = true;
		const data = {
			region_id: this.selectedTab == 'all_store' ? null : this.filterInput?.region_id,
		};
		try {
			const response: any = await this.service.resetPoints(data);
			this.getData();
			this.gs.showToastSuccess(response?.message);
		} catch (error) {
			console.log(error);
			this.gs.showToastError(error.message);
		} finally {
			this.loading = false;
		}
	}

	downloadReport() {
		this.loading = true;
		const data = {
			region_id: this.selectedTab == 'all_store' ? null : this.filterInput?.region_id,
		};
		this.service.exportPointsReport(data)
			.then((response: any) => {
				this.gs.exportAsExcelFile(response.csv, "Points Report");
			})
			.catch((error) => {
				this.gs.showToastError(error.message);
				console.log(error);
			})
			.finally(() => {
				this.loading = false;
			});
	}

	setTab(state) {
		if (state == this.selectedTab) {
			return;
		}
		if (state === 'all_store') {
			this.displayedColumns = this.isRewardsGateway ? ['name', 'store', 'points', 'badges', 'gifts'] : ['name', 'store', 'rank', 'points', 'badges'];
			this.onTabChange.emit(false);
		} else if (state === 'current_store') {
			this.paginator = null;
			this.displayedColumns = this.isRewardsGateway ? ['name', 'points', 'badges', 'gifts', 'action'] : ['name', 'rank', 'points', 'badges', 'action'];
			this.onTabChange.emit(true);
		}
		this.selectedTab = state;
		this.getData();
	}

	// ngOnChanges(changes: SimpleChanges) {
	// }

	openRewardModal(element) {
		this.dialogService.open(NewRewardComponent, {
			hasBackdrop: true,
			closeOnBackdropClick: false,
			context: { data: element, filterInput: this.filterInput },
		}).onClose.subscribe((item) => {
			if (item) {
				this.getData();
			}
		});
	}

	openMessageModal() {
		this.dialogService
			.open(NewAnnouncementComponent, {
				hasBackdrop: true,
				closeOnBackdropClick: false,
				context: { 
					        selectedRegion: this.sharedRegion == 'current_store' ? null : this.sharedRegion,
							regionId: this.selectedTab == 'all_store' ? null : this.filterInput?.region_id,
						   lastAnnouncement: this.lastAnnouncement
						 }
			})
			.onClose.subscribe((isReload) => {
				if (isReload) {
					this.getData();
				}
			});
	}

	// openExtraPointsModal(element) {
	// 	if (element.is_manual_recognised) {
	// 		return;
	// 	}
	// 	this.dialogService
	// 		.open(ExtraPointsComponent, {
	// 			hasBackdrop: true,
	// 			closeOnBackdropClick: false,
	// 			context: { user: { id: element.id, name: element.name }, manualPoints: this.manualPoints },
	// 		})
	// 		.onClose.subscribe((item) => {
	// 			this.getData();
	// 		});
	// }

	// percentage(item) {
	// 	return (item.points / this.totalPoints) * 100;
	// }

	// status(item) {
	// 	const val = this.percentage(item);
	// 	if (val <= 25) {
	// 		return 'danger';
	// 	} else if (val <= 50) {
	// 		return 'warning';
	// 	} else if (val <= 75) {
	// 		return 'info';
	// 	} else {
	// 		return 'success';
	// 	}
	// }

	closeDetails() {
		this.showSideBar = false;
		this.gs.showBackDrop(false);  
	}

	onSearch(searchText) {
		this.gs.logEvents('search_recognition_page')
		this.searchOn = searchText.trim();
		if (this.pageEvent) {
			this.pageEvent.pageIndex = 0;
		}
		this.getData();
	}

	// onSearchAll(searchText) {
	// 	this.searchOn = searchText.trim();
	// 	this.onFilterChange(null);
	// }

	// onFilterChange(value) {
	// 	this.filterOn = value;
	// 	this.showHelperButton = true;
	// 	this.searchContext = value ? false : true;
	// }

	addSearchAnalytics() {
		this.analytics.logEvents("search_user_recognition");
	}


	getData() {
		this.filterInput = { 'region_id': this.sharedRegion ? this.sharedRegion : null }
		this.dataSource.data = null;
		if ((!this.isAzalioPlay && !this.isBoringPlay && this.filterInput.region_id === null)
			|| ((this.isAzalioPlay || this.isBoringPlay) && this.selectedTab != 'all_store' && this.filterInput.region_id === null)) {
			return;
		}
		if (this.selectedTab == 'all_store' && (this.isAzalioPlay || this.isBoringPlay)) {
			this.filterInput.region_id = null;
		}
		this.loading = true;
		this.service
			.getUserPointsTableData(this.searchOn, this.pageEvent, this.filterInput)
			.then((response) => {
				this.dataSource.data = response.users;
				// this.totalPoints = response.total_points;
				// this.marathonPeriod = response.reset_period;
				this.isRewardsNoti =  response.is_rewards_noti == 1 ? true : false;
				this.lastAnnouncement = response.last_announcement;
                this.resetDate = response.reset_date;
				this.paginator = response.pagination;
				this.emptySearchResults = response.users?.length === 0 && this.searchOn ? true : false;
				this.emptyResults = response.users?.length === 0 && !this.searchOn ? true : false;
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				this.loading = false;
				// this.pageLoading = false;
			});
	}

	ngOnDestroy() {
		this.subscriptioSingle?.unsubscribe();
		this.subscription?.unsubscribe();
	}

	displayStores(el) {
		return el.stores?.join(', ');
	}
}

export interface PeriodicElement {
	user_name: string;
	user_role: string;
	region: string;
	team: string;
	email: string;
	phone_number: string;
	status: string;
}
