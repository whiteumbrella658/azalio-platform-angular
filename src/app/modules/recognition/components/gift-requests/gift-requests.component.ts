import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { avatarOpacity } from 'src/constants';
import { RecognitionService } from '../../recognition.service';

@Component({
  selector: 'app-gift-requests',
  templateUrl: './gift-requests.component.html',
  styleUrls: ['./gift-requests.component.scss']
})
export class GiftRequestsComponent implements OnInit {

  @Input() show: boolean;
  @Input() regionId: any;
  @Output() refreshData: EventEmitter<null> = new EventEmitter<null>();

  requests: any;
  opacity: number;
  selectedRow: any;
  rejectText: string;
  reason: any;
  approveText: string;
  actionLoading: boolean;
  loading: boolean;
  emptyResults: boolean;
  markAsText: string;

  constructor(public storageService: LocalStorageService,
    private service: RecognitionService, private gs: GeneralService, private dataService: DataSharedService) { 
    this.opacity = avatarOpacity;
  }

  ngOnInit(): void {
    this.dataService.setRewardsNotiCache(null);
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

  setText(el) {
    this.selectedRow = el;
    this.markAsText = "<span>You're about to confirm the delivery of <b> Gift Card </b> requested by </span> <b>" +
      this.titleCase(el.user_name) + ". <span class='colored-text'> <br> This will be visible to the user on the mobile app. </span><b><br> Are you sure?</b>";
  }

  setRejectText(el) {
    this.selectedRow = el;
    this.rejectText = "<span>You're about to reject <b> Gift Card </b> requested by </span> <b>" +
      this.titleCase(el.user_name) + ". <span class='colored-text'> <br> This will be visible to the user on the mobile app.</span><b><br> Are you sure?</b>";
  }

  setApproveText(el) {
    this.selectedRow = el;
    this.approveText = "<span>You're about to approve <b> Gift Card</b> requested by </span> <b>" +
    this.titleCase(el.user_name) +". </b><span class='colored-text'> <br> This will be visible to the user on the mobile app.</span><b><br> Are you sure?</b>";
  }

  rejectWithComment(data, id) {
    this.reason = data.reason && data.reason !== '' ? data.reason : null;
    this.respondToGiftRequest(data.isChecked, id);
  }

  deliverWithComment(data, id) {
    this.reason = data.reason && data.reason !== '' ? data.reason : null;
    this.markAsDelivered(id);
  }

  titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }


  async markAsDelivered(requestId) {
    this.actionLoading = true;
    const data = {
      id: requestId,
    }
    if (this.reason) {
      Object.assign(data, { reason: this.reason })
    }
    try {
      const response: any = await this.service.markAsDelivered(data);
      this.gs.showToastSuccess(response?.message);
        await this.getData();
        if (this.emptyResults) {
          this.dataService.updateRecallRewardsNotifications(true);
        }
      this.reason = '';
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error);
    } finally {
      this.actionLoading = false;
    }
  }

  async respondToGiftRequest (isAccept, requestId) {
    this.actionLoading = true;
    const data = {
      id: requestId,
      is_accept: isAccept ? true : false,
    }
    if (this.reason) {
      Object.assign(data, { reason: this.reason })
    }
    try {
      const response: any = await this.service.respondToGiftRequest(data);
      this.gs.showToastSuccess(response?.message);
        await this.getData();
        if (this.emptyResults || this.requests.every(req => req.is_approved === 1)) {
          this.dataService.updateRecallRewardsNotifications(true);
        }
      if (isAccept || this.requests.every(req => req.is_approved === 1)) {
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
      const response: any = await this.service.getGiftCardRequests(this.regionId);
      this.requests = response?.requests;
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
