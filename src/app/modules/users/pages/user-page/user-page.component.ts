import { AfterViewChecked, ChangeDetectorRef, Input, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NbDialogService, NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserTableViewComponent } from '../../components/user-table-view/user-table-view.component';
import { AddUserComponent } from '../../components/add-user/add-user.component';
import { GeneralService } from 'src/app/core/services/general.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignRegionTeamsComponent } from '../../components/assign-region-teams/assign-region-teams.component';
import { ImportUsersComponent } from '../../components/import-users/import-users.component';
import {FirestoreService} from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  providers: [NbSidebarService],
})
export class UserPageComponent implements OnInit, AfterViewChecked {
  @ViewChild(UserTableViewComponent)
  private UserTableViewComponentInstance: UserTableViewComponent;
  @ViewChild(AssignRegionTeamsComponent)
  AssignRegionTeamsInstance: AssignRegionTeamsComponent;
  @ViewChild(AddUserComponent) AddUserComponentInstance: AddUserComponent;
  @ViewChild(ImportUsersComponent)
  ImportUsersComponentInstance: ImportUsersComponent;

  sidebarOpened: boolean = false;
  // showSideBar: boolean = false;
  // showSideBarRegion: boolean = false;
  // showSideBarNested: boolean;
  // showSideBarImport: boolean;
  menuItems: any;
  assignmentData: any;
  regionData: any;
  // regionFormResetToggle: Boolean = false;
  resetAddUserFormToggle: Boolean = false;
  selectedTab: string;
  searchOn: string;
  filterOn: any;
  showHelperButton: boolean;
  checked: boolean;
  total: number;
  hierarchyCall: boolean;
  refreshData: boolean;
  nameConfig: any;
  showFilterResponsive: boolean;
  //prefShowRegionFilter: boolean;
  openAddView: boolean;
  isAddAnotherRegion:boolean;
  isAccountOwner: boolean;
  // noRegions: boolean;
  roleId:any;
  regionId:any;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataSharedService,
    private router: Router,
    private gs: GeneralService,
    private cdRef: ChangeDetectorRef,
    private nbMenuService: NbMenuService,
    private dialogService: NbDialogService,
    private analytics: FirestoreService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.selectedTab='all_users';
      this.gs.logEvents(this.selectedTab + '_tab')
    }, 2);
    this.openAddView = false;
    this.isAddAnotherRegion=false;
    this.roleId=null;
    this.regionId=null;
    this.showFilterResponsive = false;
    this.dataService
      .getConfigurations(false)
      .then((config) => {
        if (!config.role.modules?.OrganisationManagement?.enabled) {
          this.router.navigate(['401']);
        }
        if (config.role.role_id === 2 || config.role.role_title.includes('Account Owner')) {
          this.isAccountOwner = true;
        }
        this.nameConfig = config.company?.custom_names;
      })
      .finally(() => {});
      this.route.queryParamMap
      .subscribe(params => { 
      
    });
      // this.dataService.allRegions.subscribe((res: any) => {
      //   res !== null ? (Object?.keys(res)?.length == 0 ? this.noRegions = true : this.noRegions = false) : ''
      // });
    this.gs.hideSplashScreen();
    this.gs.showBackDrop(false);
    this.menuItems = [
      { title: 'Add New', data: { id: 1 } },
      { title: 'Import Excel', data: { id: 2 } },
    ];
    // this.menuItems= [{ title: 'Add New', data: {id: 1} }];
    // this.showSideBar = false;
    // this.showSideBarRegion = false;
    // this.showSideBarNested = false;
    // this.showSideBarImport = false;
    this.checked = true;
    this.refreshData = false;

    this.nbMenuService.onItemClick().subscribe((event) => {
      if (event.tag === 'addUser') {
        switch (event.item.data.id) {
          case 1:
            // this.showSideBar = true;
            // this.gs.showBackDrop(true);
            break;
          case 2:
            // this.showSideBarImport = true;
            // this.gs.showBackDrop(true);
            break;
          default:
        }
      }
    });
  }

  showImport() {
    this.dialogService.open(ImportUsersComponent, { hasBackdrop: true, closeOnBackdropClick: false }).onClose.subscribe((refresh) => {
      if (refresh) {
        this.UserTableViewComponentInstance.getData();
        this.refreshData = !this.refreshData;
      }
    });
  }

  showUser() {
    this.dialogService.open(AddUserComponent, { hasBackdrop: true, closeOnBackdropClick: false, context: {openAddView: this.openAddView, roleId:this.roleId, regionId:this.regionId }, })
    .onClose.subscribe((data) => {
      if (data.refresh) {
        this.UserTableViewComponentInstance.getAllUsersCount();
        this.openAddView = false;
        this.roleId=null;
        this.regionId=null;
        this.UserTableViewComponentInstance.getData();
      } else if (!data.refresh && data.createAnother) {
        this.roleId=data.roleId;
        this.regionId=data.regionId;
        this.openAddView = true;
        this.UserTableViewComponentInstance.getData();
        this.UserTableViewComponentInstance.getAllUsersCount();
        this.showUser(); //re-open
      } else {
        this.openAddView = false;
        this.roleId=null;
        this.regionId=null;
      }
    });
  }

  totalReceived(count: number) {
    this.total = count;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }


  // reloadData() {
  //   this.closeSideBars();
  //   this.UserTableViewComponentInstance.getData();
  //   // this.refreshData = !this.refreshData;
  // }

  // closeSideBars() {
  //   // this.showSideBarNested = false;
  //   // this.AssignRegionTeamsInstance.clearSearchField();
  //   // setTimeout(() => {
  //   //   this.showSideBar = false;
  //   // }, 200);
  //   this.AddUserComponentInstance.resetForm();
  //   this.gs.showBackDrop(false);
  // }

  // closeImportSidebar = () => {
  //   this.showSideBarImport = false;
  //   this.ImportUsersComponentInstance.resetForm();
  //   this.gs.showBackDrop(false);
  //   this.UserTableViewComponentInstance.getData();
  //   this.refreshData = !this.refreshData;
  // };

  // closeRegionSidebar = () => {
  //   this.showSideBarRegion = false;
  //   this.AddRegionComponentInstance.resetForm();
  //   this.regionData = null;
  //   this.gs.showBackDrop(false);
  // };

  temp($event) {
    // this.regionData = $event;
    // this.showSideBarRegion = true;
    // this.gs.showBackDrop(true);
  }

  // populateData($event) {
  //   console.log($event);
  //   this.showSideBarNested = false;
  //   this.assignmentData = $event;
  // }

  // setTab($event, state) {
  //   if ($event) {
  //     this.selectedTab = state;
  //   }
  // }

  onSearch(searchText) {
    this.gs.logEvents('search_organisation_page')
    this.searchOn = searchText.trim();
  }

  onSearchAll(searchText) {
    this.searchOn = searchText.trim();
  }


  // onRegionSuccess() {
  //   this.hierarchyCall = !this.hierarchyCall;
  //   this.showSideBarRegion = false;
  //   this.regionData = null;
  //   this.refreshData = !this.refreshData;
  //   this.UserTableViewComponentInstance.getData();
  //   this.gs.showBackDrop(false);
  // }

  callRegionHierarchy() {
    this.hierarchyCall = !this.hierarchyCall;
  }
  toggleAnalytics(){
    this.analytics.logEvents("toggle_users");
  }

  setTab(state) {
    // alert(this.selectedTab);
    // if (state == this.selectedTab) {
    //   return;
    // }
    this.selectedTab = state;
    this.gs.logEvents(this.selectedTab + '_tab')
  }
}
