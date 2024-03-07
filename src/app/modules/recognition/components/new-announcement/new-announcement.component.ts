import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { RecognitionService } from '../../recognition.service';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.scss']
})
export class NewAnnouncementComponent implements OnInit {
  @Input() regionId;
  @Input() selectedRegion;
  @Input() lastAnnouncement;
  form: FormGroup;
  loading: boolean;
  isAllStores: string;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<NewAnnouncementComponent>,
    private service: RecognitionService,
    private gs: GeneralService
  ) {
    this.form = this.fb.group({
      message: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    this.isAllStores = this.regionId ? '0' : '1';
    this.lastAnnouncement = this.lastAnnouncement;
    this.selectedRegion = this.selectedRegion;
  }

  submit(ngForm) {
    if (ngForm.valid) {
      this.sendAnnouncement();
    }
  }

  sendAnnouncement = async () => {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      region_id: this.isAllStores == '1' ? null : this.selectedRegion,
      announcement: this.form.get('message').value,
    };
    try {
      const response: any = await this.service.sendAnnouncement(data);
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      console.log(error);
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

  close(openNext): void {
    this.ref.close(openNext);
  }

}
