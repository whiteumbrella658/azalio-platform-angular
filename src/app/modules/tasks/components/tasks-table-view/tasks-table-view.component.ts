import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, paginatorOptions } from 'src/constants';
import { TasksService } from '../../tasks.service';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Router } from '@angular/router';
import { NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { AddTaskComponent } from '../add-task/add-task.component';
@Component({
  selector: 'app-tasks-table-view',
  templateUrl: './tasks-table-view.component.html',
  styleUrls: ['./tasks-table-view.component.scss']
})
export class TasksTableViewComponent implements OnInit {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  displayedColumns: string[] = ['name', 'last_known_status', 'assignment', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  paginator: { page_no: number; page_size: number; total_records: number; };
  searchOn: any;
  showHelperButton: boolean;
  loading: boolean;
  searchText: any;
  pageEvent: any;
  filterInput: any;
  filterOn: { region_id: any; };
  subscription: any;
  subscriptioSingle: any;
  sharedRegion: any;
  singleRegion: any;
  form: FormGroup;
  newest: any;
  emptySearchResults: boolean;
  emptyResults: boolean;
  showComments: boolean;
  selectedRowData: any = null;
  deleteText: string = "You're about to <b>permanently delete</b> this task. Are you sure?"
  pageLoading: boolean = false;
  editForm: FormGroup;
  selectedRowDataEdit: any = null;
  sortPopup: boolean = false;
  // filterPopup: boolean = false;
  coinPopup: boolean = false;
  shiftPopup: boolean = false;
  shiftPopupUser: boolean = false;
  filters: any;
  shiftsArr: any[] = null;
  coins: number[] = [0, 10, 20, 50, 100];
  selectedFilterItem: any;
  opacity: number;
  isTasksEnabled:boolean;
  selectedForAssignment: any;
  isAzalioPlay: boolean;
  selectedCoins: number = 10;
  isAllStores: string;
  selectedShift: any;
  allShifts: boolean;
  permissions: any;
  userNameEdit: any;
  selectedUser: any;
  endIndex: number;
  startIndex: number;
  shiftsFilterArr: any;
  selectedElem: any;
  additionalDetails: any = null;
  custom: any = null;
  filter: { tag: any;};
	isFiltered: {tag: boolean;};
  tags: { id: number; tag: string; color: string; }[];
  tagsData: any;
  isBoringPlay: boolean;
  allDay: boolean;
  isStore: boolean;
  isAddEditTagsOnly: boolean = false;
  constructor(
    public gs: GeneralService,
    private fb: FormBuilder,
    private service: TasksService,
    private dataService: DataSharedService,
    private dialogService: NbDialogService,
    private router: Router,
    private analytics: FirestoreService,
    ) { 
    this.pageLoading = true;
    this.editForm = this.fb.group({
      taskName: ['', [Validators.required]],
    });

    this.showHelperButton = true;
    this.loading = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (!config.role.modules?.Tasks?.enabled) {
        this.router.navigate(['401'])
      }
      this.isTasksEnabled =config.role.modules?.Tasks?.enabled;
      this.isAzalioPlay = config.company?.is_azalio_play === 1 ? true : false;
      this.isBoringPlay = config.company?.boring2Fun === 1 ? true : false;
      this.permissions = config.permissions;

      this.gs.hideSplashScreen();
    }).finally(() => {
      this.isAllStores = '0';
      if (this.isAzalioPlay) {
        this.allShifts = true;
      }
      if (this.isAzalioPlay || this.isBoringPlay) {
        this.displayedColumns = ['name', 'points', 'shifts', 'last_known_status', 'assignment'];
        if (this.permissions.Tasks.update) {
          this.displayedColumns = [...this.displayedColumns, ...['action']];
        }
      }
      this.dataService.getTaskTags(false).then((tags) => {
        this.tags = tags; 
      }).finally(() => {});	
    });
    
    this.subscriptioSingle=this.dataService.SingleRegionId.subscribe((res: any) => {
      this.sharedRegion = res;
      this.singleRegion = res
      if (res !== null && res > 0) {
        this.isStore = true; //if single region, display store.
      }
      this.resetShiftFilter();
      if (this.selectedFilterItem) {
          this.getData(true);
      }
      }); 
   
        if(!this.singleRegion){
          this.subscription=this.dataService.SharingRegionData.subscribe((res: any) => {
            this.sharedRegion = res;
            if (this.sharedRegion != 0) {
              this.isStore = true;
            }
            this.resetShiftFilter();
            if (this.selectedFilterItem) {
              this.getData(true);
            }
          });
        } else {
          this.isStore = true;
        }
  }


  getStatusClass(el) {
    if (el.modification.includes('undone')) {
      return 'undone';
    }
    else if (el.modification.includes('done')) {
      return 'done';
    }
    return 'comment';
  }

  resetShiftFilter() {
    this.allShifts = true;
    this.selectedShift = null;
    this.startIndex = 0; 
    this.endIndex = 3;
  }

  ngOnInit(): void {
    this.filter = {tag: null};
		this.isFiltered = {tag: false};
    this.form = this.fb.group({
      taskName: ['', [Validators.required]],
      points: [''],
      taskRepeatsArr: new FormArray([]),
      allShiftRepeats: [1],
      allDayRepeats: [1],
      tag: [],
    });
    this.startIndex = 0;
    this.endIndex = 3;
    this.selectedRowDataEdit = null;
    this.opacity = avatarOpacity;
    this.showComments = false;
    this.newest = true;
    this.paginator = paginatorOptions;
    this.gs.showBackDrop(false);
    this.getFilters();
  }

  closeFilter(key) {
		this.form.controls[key].setValue(this.filter?.[key]);
	}

	applyFilterMulti(key) {
    this.gs.logEvents('tasks_filtered_by_' + key)
		let val = this.form.controls[key].value;
		if (val && val.length > 0) {
			this.isFiltered[key] = true;
			this.filter[key] = val;
		} else {
			this.filter[key] = null;
			this.isFiltered[key] = false;
		}
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
		this.getData();
	}

  removeFilter(key) {
		this.filter[key] = null;
		this.isFiltered[key] = false;
		this.getData();
	}

  selectCoins($event, coin) {
    if (isNaN(coin)) {
      $event.stopPropagation();
      return;
    }
    this.selectedCoins = coin;
    this.coinPopup = false;
  }

  async updatePriority(task) {
    this.analytics.logEvents("mark_task_priority");
      if (this.loading) {
        return;
      }
      this.loading = true;
      const data = {
        "task_id":  task.id,
        "task_priority": task.priority === 'HIGH' ? 1 : 2 
      }    

      try {
        const response: any = await this.service.updateTaskPriority(data);
        this.gs.showToastSuccess(response?.message);
        this.getData();
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.loading = false;
      }
  }

  
async getFilters() {
    try {
      const response: any = await this.service.getFilters();
      this.filters = response.filters;
      this.selectedFilterItem = this.filters[0];
      this.getData(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
    }
}

setFilter(item) {
  this.analytics.logEvents("filter_tasks");
  this.selectedFilterItem = item;
  if (this.pageEvent) {
    this.pageEvent.pageIndex = 0;
  }
  this.getData();
}

setShiftFilter(item) {
  this.analytics.logEvents("filter_tasks_shifts");
  this.selectedShift = item;
  if (this.pageEvent) {
    this.pageEvent.pageIndex = 0;
  }
  this.getData();
}

  async addTask() {
    if (this.loading) {
      return;
    }
    if (this.form.valid) {
      let repeats = null;
      this.sharedRegion = this.sharedRegion && this.sharedRegion > 0 ? this.sharedRegion : this.singleRegion;
      if (this.allShifts) {
        repeats = Number(this.form.controls.allShiftRepeats.value)
      } 
      if (this.allDay) {
        repeats = Number(this.form.controls.allDayRepeats.value)
      }
      
      let shiftsData = this.shiftsArr?.length > 0 ? this.shiftsArr?.map((x, index)=> {
          if (x.selected) {
            return {shift_id: x.id, task_repeats: Number(this.taskRepeats.controls[index].value.count)}
          }
        }).filter(x=> x !== undefined) : null;

      const data = this.selectedRowDataEdit !== null ? {
        task_id:  this.selectedRowDataEdit.id,
      }: 
      {
        region_id:  this.sharedRegion,
        task_priority: 1, //Normal
      }

      if (!this.selectedRowDataEdit) {
        this.selectedFilterItem = this.filters[2];  
      }

      if (this.isBoringPlay || this.isAzalioPlay) {
        Object.assign(data, {
          points: this.selectedCoins === 0 ? null : this.selectedCoins,
        });
      }

        Object.assign(data, {
          task_name: this.form.controls.taskName.value,
          description: this.additionalDetails ? this.additionalDetails : null,
          tags: this.tagsData ? this.tagsData : [],
          custom: this.custom ? this.custom : {days: null, dates: null},
          task_repeats: repeats,
          shift_id:  repeats == null ? shiftsData : null,
          all_shifts: Boolean(this.allShifts),
          all_stores: this.isAllStores == '0' || !this.permissions?.Tasks?.add_bulk ? false : true,
        })

        if ((data['shift_id']?.length == 0 || data['shift_id'] == null) && repeats == null) {
          this.gs.showToastWarning('Please select a shift');
          return;
        }


      try {
        this.loading = true;
        const response: any = 
        this.selectedRowDataEdit ? await this.service.editTask(data) : await this.service.addNewTask(data);
        this.gs.showToastSuccess(response?.message);
        this.form.controls.taskName.setValue('');
        this.resetEditAzalioPlay();
        this.getData();
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.loading = false;
      }
    }
  }

  resetEditAzalioPlay() {
    // if (!this.isAzalioPlay && !this.isBoringPlay) {
    //   return;
    // }
    this.form.controls.taskName.setValue('');
    this.selectedRowDataEdit = null;
    this.custom = null;
    this.tagsData = null;
    this.additionalDetails = null;
    // if(this.additionalDetails) {
    //   Object.keys(this.additionalDetails)?.forEach(entity => {
    //     this.additionalDetails[entity] = null
    //   });
    // }
  }

  async editTask() {
    if (this.editForm.valid && this.selectedRowDataEdit?.id) {
      this.loading = true;
      const data = {
        "task_id":  this.selectedRowDataEdit.id,
        "task_name": this.editForm.controls.taskName.value,
      }    

      try {
        const response: any = await this.service.editTask(data);
        this.gs.showToastSuccess(response?.message);
        this.toggleEditMode(null);
        this.getData();
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.loading = false;
      }
    }
  }
  addDeleteAnalytics(){
    this.analytics.logEvents("delete_task");
  }
  deleteTask =  async (taskId) => {
    this.loading = true;
    const data = {
      task_id: taskId,
    }
    try {
      const response: any = await this.service.deleteTask(data);
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  updateTableHeader(shifts = false) {
     if (shifts) {
      this.allDay = false;
      this.allShifts = true;
      if (this.displayedColumns.includes('shifts')) {
        return;
      } 
      this.displayedColumns.includes('points') ?  this.displayedColumns.splice(2, 0, 'shifts') :  this.displayedColumns.splice(1, 0, 'shifts');
     } else {
        this.allDay = true;
        this.allShifts = false;
        let index = this.displayedColumns.indexOf('shifts');
        if (index !== -1) {
          this.displayedColumns.splice(index, 1);
        }
     }
  }

  getData(updateShifts: boolean = false) {
    this.filterInput = { 
      filter_id: this.selectedFilterItem ? this.selectedFilterItem.id : 3, 
      region_id: this.sharedRegion ? this.sharedRegion : null,
    }
    if (this.shiftsFilterArr?.length > 0 && this.selectedShift) {
      Object.assign(this.filterInput, { shift_id: this.selectedShift ? this.selectedShift.id : null});
    }
    if (this.filterInput.region_id === null) {
      return;
    }
    this.loading = true;
    this.service.getTasksTableData(this.searchText, this.pageEvent, this.filterInput, this.filter)
      .then((response) => {
        this.dataSource.data = response.tasks;
				this.paginator = response.pagination;
        if (response.shifts?.length > 0) {
          this.updateTableHeader(true);
          this.shiftsFilterArr = response.shifts;
          for (let i = 0; i < response.shifts.length; i++) {
            this.taskRepeats.push(
              this.fb.group({
                count: [1],
              })
            );
          }
        } else {
          this.shiftsFilterArr = null;
          this.updateTableHeader(false);
        }
        if (updateShifts) {
          this.shiftsArr = response.shifts;
        //   this.allShifts = true
        }
        this.emptySearchResults = response.tasks?.length === 0 && 
        (this.searchText || this.filterInput?.shift_id || this.filter?.tag !== null)  ? true : false;
        this.emptyResults = response.tasks?.length === 0 && (!this.searchText && !this.filterInput?.shift_id && !this.filter?.tag) ? true : false;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
    }

  get taskRepeats() {
    return this.form.controls.taskRepeatsArr as FormArray;
  }

  setSliceIndex() {
      this.startIndex = this.startIndex == 0 ? 3 : 0;
      this.endIndex = this.endIndex == 3 ? 6 : 3;
  }

  addSearchAnalytics(){
      this.analytics.logEvents("search_task");
  }

  selectAllShifts() {
    this.allShifts = this.allShifts ? false : true;
    if (this.allShifts) {
      this.allDay = false;
    }
  }
  selectAllDay() {
    this.allDay = this.allDay ? false : true;
    if (this.allDay) {
      this.allShifts = false;
    }
  }

  showButton(shifts) {
    if (!shifts) {
      return false;
    }
    return shifts?.filter(x => x.assigned_to_user_name == null)?.length > 0 ? true : false;
  }

  getSelectedShiftCount() {
    if (!this.shiftsArr) {
      return 'Select';
    }
    return this.shiftsArr?.filter(x=> x.selected)?.length + ' shifts';
  }

  getSelectedShiftUser(element) {
     const res = element.shifts?.filter(x=> x.selected);
     let shiftName = 'Select shift';
     if (res && res.length > 0) {
      shiftName = res?.length === 1 ? res[0].name : res?.length + ' shifts';
     }
     return shiftName;
  }

  disableInput(element) {
    if (element.shifts && this.selectedUser) {
      return false;
    }
    if (element.shifts && 
      this.getSelectedShiftUser(element) === 'Select shift') {
      return true;
    }
    return false;
  }

  onSearch(searchText) {
    this.gs.logEvents('search_task')
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

  navigateToReports() {
    this.router.navigate(['tasks/report'])
  }

  onSearchAll(searchText) {
    this.searchOn = searchText.trim();
  }

  openTaskComments(element) {
    this.showComments = true;
    this.selectedRowData = element;
  }

  closeDetails() {
    this.showComments = false;
    this.selectedRowData = null; 
    this.gs.showBackDrop(false);  
  }

  cancelEdit() {
    if (this.selectedRowDataEdit) {
        this.resetEditAzalioPlay(); //checks inside this function
    }
  }

  mergeArrayObjects(arr1, arr2) {
    return arr1.map((item, i) => {
      const res = arr2.find(x=> x.id == item.id);
      if (res) {
        item['selected'] = true;
        //merging two objects
        const form = this.taskRepeats.controls[i] as FormGroup;
        form.controls.count.setValue(res.task_repetition);
        return Object.assign({}, item, {'task_repetition': res.task_repetition })
      } else {
        return Object.assign({}, item)
      }
    })
  }
  
  setBasicFields(row) {
    const value = row ? row.name : '';
    setTimeout(() => {
      this.shiftsArr = this.shiftsArr ? this.mergeArrayObjects(this.shiftsArr, row.shifts ? row.shifts : []) : null;
      if (this.allShifts && this.shiftsArr?.length > 0) {
        this.form.controls.allShiftRepeats.setValue(this.shiftsArr[0].task_repetition);
      }  
      // else if (this.allDay && this.shiftsArr?.length > 0) {
      //   this.form.controls.allDayRepeats.setValue(this.shiftsArr[0].task_repetition);
      // } 
    });

    this.form.controls.taskName.setValue(value);
    setTimeout(() => {
      if (row) {
        const el = document.getElementById('task-input');
        el.focus();
      }});

    // if (!this.isAzalioPlay) {
    //   this.form.controls.taskName.setValue(value);
    //   setTimeout(() => {
    //     if (row) {
    //       const el = document.getElementById('task-input');
    //       el.focus();
    //     }});
    // }
    if (this.isBoringPlay || this.isAzalioPlay) {
      this.selectedCoins = row.points;
      if (!this.coins.includes(row.points)) {
        this.form.controls.points.setValue(row.points);
      }
    }
    if (this.isAzalioPlay || this.shiftsFilterArr?.length > 0) {
      this.shiftsArr = JSON.parse(JSON.stringify(this.shiftsFilterArr));
      // this.selectedCoins = row.points;
      // if (!this.coins.includes(row.points)) {
      //   this.form.controls.points.setValue(row.points);
      // }

      // const ids = row.shifts?.map(y => y.id);
      // this.shiftsArr.forEach((x, index)=> {
      // x['selected'] = ids.includes(x.id) ? true : false;
      // });
      // this.form.controls.taskName.setValue(value);
      // setTimeout(() => {
      // if (row) {
      //   const el = document.getElementById('task-input');
      //   el.focus();
      // }
      // });
      // this.openAddTaskPopup()
     return;
    }
    this.editForm.controls.taskName.setValue(value);
  }

  toggleEditMode(row) {
    this.analytics.logEvents("edit_task_icon");
    this.selectedRowDataEdit = row;
    this.additionalDetails = row.description ? row.description : '';
    this.tagsData = row.tags?.length > 0 ? row.tags.map(x=> x.id) : null;
    this.custom = row.custom ? row.custom : null;
    this.form.controls.allDayRepeats.setValue(row.task_repetition)

    if (this.isAddEditTagsOnly) {
      this.openAddTaskPopup();
      this.cancelEdit();
    } else {
      this.allShifts = this.shiftsFilterArr?.length > 0 ? row.all_shifts : false; 
      this.isAllStores = row.all_store ? row.all_store.toString() : '0';
      this.allDay = !this.allShifts && row.task_repetition && row.task_repetition > 0 ? true : false;
      this.setBasicFields(row);    
    }
  }

  onSelectedUser($event, element) {
    const userId = $event ? $event.id : null;
    const shifts = element.shifts ? element.shifts.filter(x=> x.selected).map(y=> y.id) : null;
    this.assignUserToTask(userId, shifts);
  }

  assignUserToTask =  async (userId, shifts) => {
    this.loading = true;
    const data = {
      task_id: this.selectedForAssignment,
      assign_to: userId,
    }
    if (shifts) {
      Object.assign(data, {'shifts': shifts});
    }
    try {
      const response: any = await this.service.assignTaskToUser(data);
      this.gs.showToastSuccess(response?.message);
      this.selectedForAssignment = null;
      this.selectedElem = null;
      this.popover.hide();
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  selectShift(shift) {
    shift.selected = shift.selected ? false : true;
    this.allShifts = false;
    this.allDay = false;
  }

  selectShiftUser(shift) {
    shift.selected = shift.selected ? false : true;
  }

  ngOnDestroy() {
		this.subscription?.unsubscribe();
    this.subscriptioSingle?.unsubscribe();
	}

  openAssignUserModal(element, userShift) {
    if (element.shifts?.length > 0) {
      this.selectedUser =  userShift ? userShift : null;
      if (userShift) {
        element.shifts.forEach(shift => {shift.selected = shift.id === userShift.id ? true : false;});
      }
    } 
    this.selectedForAssignment = element.id;
    this.selectedElem = element;
    if (this.gs?.touchEnabledDevices) {
        this.popover.show();
    }
  }

  openPopup($event) {
    if (!this.selectedUser) {
      $event.stopPropagation(); 
      this.shiftPopupUser = !this.shiftPopupUser;
    }
  }

  closePopup() {
    this.popover.hide();
  }

  onFocusOut(form) {
    const val = form.value.count;
    if (isNaN(val) || val < 1) {
      form.controls.count.setValue(1);
    }
  }

  @HostListener('document:click', ['$event.target'])
    public onClick(target) {
      if (this.sortPopup) {
        this.sortPopup = false;
      }
      // if (this.filterPopup) {
      //   this.filterPopup = false;
      // }
      if (this.coinPopup) {
        this.coinPopup = false;
      }
      if (this.shiftPopup) {
        this.shiftPopup = false;
      }
      if (this.shiftPopupUser) {
        this.shiftPopupUser = false;
        this.selectedUser = null;
      }

      setTimeout(() => {
        const el = document.getElementsByClassName('task-assignment-popup');
        const isPopup = el && el[0];
        if (!isPopup && this.selectedForAssignment) {
          this.selectedForAssignment = null;
          this.selectedElem = null;
        }
        if (!isPopup) {
          // setTimeout(() => {
            this.popover.hide();
          // }, 300);
        }
      });
    }

    openAddTaskPopup() {
      if (!this.selectedRowDataEdit && this.form.get('taskName').value?.length < 5) {
        return;
      }

      this.dialogService.open(AddTaskComponent, { hasBackdrop: true, closeOnBackdropClick: false, context: {
        shifts: this.shiftsArr,
        selectedData: this.custom,
        tagsData: this.tagsData,
        description: this.additionalDetails,
        permissions: this.permissions,
        regionId: this.sharedRegion,
        taskId: this.selectedRowDataEdit?.id,
        isAddEditTagsOnly: this.isAddEditTagsOnly ? true : false,
        isEditMode: this.selectedRowDataEdit ? true : false
      }, 
    }).onClose.subscribe((data) => {
          if (this.isAddEditTagsOnly) {
            this.isAddEditTagsOnly = false;
            if (data) {
              this.getData();
            }
            return;
          }
          if (data) {
            this.additionalDetails = data.description
            this.custom = data.custom;
            this.tagsData = data.tags;
            // this.selectedRowDataEdit ? '' : this.selectedFilterItem = this.filters[2];
            // this.getData();
          } else {
            if (this.selectedRowDataEdit) {
              this.custom = this.selectedRowDataEdit.custom;
              this.additionalDetails = this.selectedRowDataEdit.description;
              this.tagsData = this.selectedRowDataEdit.tags?.length > 0 ? this.selectedRowDataEdit.tags?.map(x=> x.id) : null;
            } else {
              this.additionalDetails = '';
              this.custom = null;
              this.tagsData = null;
            }
          }
        // this.form.controls.taskName.setValue('');
        // this.resetEditAzalioPlay();
      }); 
    }
}

export interface PeriodicElement {
  name: string;
  last_known_status: string;
  action: any;
}


