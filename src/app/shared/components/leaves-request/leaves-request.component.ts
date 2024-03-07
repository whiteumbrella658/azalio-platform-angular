import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { SchedulerService } from 'src/app/modules/scheduler/scheduler.service';
import { avatarOpacity } from 'src/constants';

@Component({
  selector: 'app-leaves-request',
  templateUrl: './leaves-request.component.html',
  styleUrls: ['./leaves-request.component.scss']
})
export class LeavesRequestComponent implements OnInit {
  requests: any;
  opacity: number;
  loading: boolean;
  reason: any;
  rejectText: string;
  selectedRow: any;
  approveText: string;
  emptyResults: boolean;
  leaveLoading: boolean;

  @Input() regionId: any;
  @Input() show: boolean;
  @Output() refreshData: EventEmitter<null> = new EventEmitter<null>();


  constructor(
    private dataService: DataSharedService,
    public gs: GeneralService, private service: SchedulerService) {
  }

  ngOnInit(): void {
    this.requests = [];
    this.regionId = this.regionId;
    this.show = this.show ? this.show : false;
    this.opacity = avatarOpacity;
    this.dataService.setNotiCache(null);
    if (this.show) {
      this.getData();
    }
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
    this.rejectText = "<span>You're about to reject <b>" + el.leave_type + "</b> requested by </span> <b>" +
      el.requested_by + "</b>. <span class='colored-text'>The user will be able to see this on their mobile device. </span><b>Are you sure?</b>";
  }

  setApproveText(el) {
    this.selectedRow = el;
    this.approveText = "<span>You're about to approve <b>" + el.leave_type + "</b> requested by </span> <b>" +
      el.requested_by + ".</b> <p>This leave will be added to the scheduler in unpublished mode and <span class='colored-text'>not be visible to the user on the mobile app until it is published.</span></p> <b>Are you sure?</b>";
  }

  setPublishText(el) {
    this.selectedRow = el;
    this.approveText = "<span>You're about to approve <b>" + el.leave_type + "</b> requested by </span> <b>" +
      el.requested_by + ".</b> <p>This leave will be added to the scheduler in published mode and <span class='colored-text'>will be visible to the user on the mobile app.</span></p> <b>Are you sure?</b>";
  }

  proceed(data, isPublish) { //accept leave
    this.respondToLeave(1, data.id, isPublish)

  }

  rejectLeaveWithComment(data, pointsId) {
    this.reason = data.reason && data.reason !== '' ? data.reason : null;
    this.respondToLeave(data.isChecked, pointsId);
  }

  async respondToLeave (isAccept, requestId, isPublish = false)  {
    this.leaveLoading = true;
    const data = {
      id: requestId,
      accept: isAccept ? true : false,
      publish: isAccept && isPublish ? true : false,
    }
    if (this.reason) {
      Object.assign(data, { reason: this.reason })
    }
    try {
      const response: any = await this.service.respondToLeaveRequest(data);
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
      this.leaveLoading = false;
    }
  }

  async getData() {
    if (this.regionId == null || this.regionId == undefined) {
      return;
    }
    this.loading = true;
    // this.requests = [];
    try {
      const response: any = await this.service.getLeaveRequests(this.regionId);
      this.requests = response.requests;
      this.emptyResults = this.requests && this.requests?.length == 0;
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

}
