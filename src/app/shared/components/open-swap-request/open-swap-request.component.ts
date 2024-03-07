import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { SchedulerService } from 'src/app/modules/scheduler/scheduler.service';

@Component({
  selector: 'app-open-swap-request',
  templateUrl: './open-swap-request.component.html',
  styleUrls: ['./open-swap-request.component.scss']
})
export class OpenSwapRequestComponent implements OnInit {
  @Output() refreshData: EventEmitter<null> = new EventEmitter<null>();
  requests: any;
  emptyResults: boolean;
  @Input() regionId: any;
  @Input() show: boolean;
  loading: boolean;
  isSwapApprovalRequired: boolean;
  isOpenApprovalRequired: boolean;
  selectedRow: any;
  rejectText: string;
  approveText: string;
  reason: any;
  actionLoading: boolean;
  isOpen: boolean;
  isSwap: boolean;

  constructor(
    private gs: GeneralService,
    private service: SchedulerService, private dataService: DataSharedService) { 
      this.dataService
      .getConfigurations(false)
      .then((config) => {
        this.isSwap = config.company?.is_swap_shift == 1 ? true : false; 
        this.isOpen = config.company?.is_open_shift == 1 ? true : false; 
        this.isSwapApprovalRequired = config.company?.swap_manager_approval  === 1 ? true : false;
        this.isOpenApprovalRequired = config.company?.open_manager_approval  === 1 ? true : false;
      })
      .finally(() => {});
    }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.regionId && changes.regionId.currentValue !== changes.regionId.previousValue) {
      this.regionId = changes.regionId.currentValue;
      this.requests = null;
      this.emptyResults = false;
      if (this.show) {
        this.getData();
      }
    }
    if (changes.show && changes.show.currentValue !== changes.show.previousValue) {
      this.show = changes.show.currentValue;
      if (changes.show.currentValue == true) {
        this.getData();
      }

    }
  }
  
  setRejectText(el) {
    this.selectedRow = el;
    this.rejectText = "<span>You're about to reject <b> swap shift </b> requested by </span> <b>" +
      this.titleCase(el.requested_by) + "</b> with <b>" + this.titleCase(el.accepted_by) + ".</b> <p> <span class='colored-text'> Both users will be able to see this on their mobile device. </span><br></p><b>Are you sure?</b>";
  }

  setPublishText(el) {
    this.selectedRow = el;
    this.approveText = "<span>You're about to approve <b> swap shift </b> requested by </span> <b>" +
    this.titleCase(el.requested_by) + "</b> with  <b>"+ this.titleCase(el.accepted_by) + ".</b> <p>The schedules will be swapped in published mode and <span class='colored-text'>will be visible to the users on the mobile app.</span></p> <b>Are you sure?</b>";
  }

  setRejectTextOpen(el) {
    this.selectedRow = el;
    this.rejectText = "<span>You're about to reject <b> open shift </b> requested by </span> <b>" +
      this.titleCase(el.requested_by) + "</b> which has been accepted by <b>" + this.titleCase(el.accepted_by) + ".</b> <p> <span class='colored-text'> Both users will be able to see this on their mobile device. </span><br></p><b>Are you sure?</b>";
  }

  setPublishTextOpen(el) {
    this.selectedRow = el;
    this.approveText = "<span>You're about to approve <b> open shift </b> requested by </span> <b>" +
    this.titleCase(el.requested_by) + "</b> which has been accepted by <b>" + this.titleCase(el.accepted_by) + ".</b> <p>The schedule will be updated in published mode and <span class='colored-text'>will be visible to the users on the mobile app.</span></p> <b>Are you sure?</b>";
  }

  rejectSwapWithComment(data, id) {
    this.reason = data.reason && data.reason !== '' ? data.reason : null;
    this.respondToSwap(data.isChecked, id);
  }

  rejectOpenWithComment(data, id) {
    this.reason = data.reason && data.reason !== '' ? data.reason : null;
    this.respondToOpen(data.isChecked, id);
  }

  titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  async respondToSwap (isAccept, requestId) {
    this.actionLoading = true;
    const data = {
      id: requestId,
      is_accept: isAccept ? true : false,
    }
    if (this.reason) {
      Object.assign(data, { reason: this.reason })
    }
    try {
      const response: any = await this.service.respondToSwap(data);
      this.gs.showToastSuccess(response?.message);
        await this.getData();
        if (this.emptyResults) {
          this.dataService.updateRecallNotifications(true);
        }
      if (isAccept) {
        this.refreshData.emit();
      }
      this.reason = '';
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.actionLoading = false;
    }
  }

  async respondToOpen (isAccept, requestId) {
    this.actionLoading = true;
    const data = {
      id: requestId,
      is_accept: isAccept ? true : false,
    }
    if (this.reason) {
      Object.assign(data, { reason: this.reason })
    }
    try {
      const response: any = await this.service.respondToOpen(data);
      this.gs.showToastSuccess(response?.message);
        await this.getData();
        if (this.emptyResults) {
          this.dataService.updateRecallNotifications(true);
        }
      if (isAccept) {
        this.refreshData.emit();
      }
      this.reason = '';
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.actionLoading = false;
    }
  }

  async getData() {
    if (this.regionId == null || this.regionId == undefined) {
      return;
    }
    this.loading = true;
    try {
      const response: any = await this.service.getOpenSwapHistory(this.regionId);
      this.requests = response;
      this.emptyResults = this.requests && this.requests?.length == 0;
    } catch (error) {
      this.requests = [];
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.loading = false;
    }
  }
}
