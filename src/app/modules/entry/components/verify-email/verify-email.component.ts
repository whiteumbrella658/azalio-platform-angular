import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { EntryService } from '../../entry.service';
import { GeneralService } from 'src/app/core/services/general.service';
import {FirestoreService} from '../../../../core/services/firestore.service';
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  loading: Boolean = false;
  @Input() data;
  constructor(private ref:NbDialogRef<VerifyEmailComponent>,
     private service: EntryService, 
     private gs: GeneralService,
     private analytics: FirestoreService) { }

  
  close() {
    this.ref.close();
  }

  resendInvite = async () => {
    this.analytics.logEvents('resend_email');
    const data = {
      "admin_name": this.data.name,
      "admin_email_address": this.data.email,
      "admin_password": this.data.password,
    }

    try {
      this.loading = true;
      const response: any = await this.service.registerCompanyAdmin(data);
      this.gs.showToastSuccess(response?.message);
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

}
